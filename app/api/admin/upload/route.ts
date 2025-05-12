import Sharp from "sharp";
import { type NextRequest, NextResponse } from "next/server";
import { formDataReader } from "@/lib/api/formDataReader";
import { checkAuth } from "@/lib/auth/server";
import { Role } from "@prisma/client";
import { authError } from "@/lib/auth/error";
import { createId } from "@paralleldrive/cuid2";
import { uploadFile } from "@/lib/services/s3";

const ALLOWED_EXTENSIONS = [
  "jpg",
  "jpeg",
  "png",
  "webp",
  "svg",
  "avif",
] as const;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const OPTIMIZED_QUALITY = 80; // default quality for optimization

const MIME_TYPES = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  svg: "image/svg+xml",
  avif: "image/avif",
} as const;

// #region Helper functions
const optimizeImage = async (
  buffer: Buffer,
  fullQuality: boolean
): Promise<Buffer> => {
  try {
    const image = Sharp(buffer);
    const metadata = await image.metadata();

    if (!metadata.format) throw new Error("Unknown image format");

    if (fullQuality) {
      return await image.withMetadata({}).toFormat(metadata.format).toBuffer();
    }

    return await image
      .withMetadata({})
      .jpeg({ quality: OPTIMIZED_QUALITY })
      .toBuffer();
  } catch (error) {
    console.error("Image optimization failed:", error);
    return buffer;
  }
};

const generateUniqueFilename = (extension: string): string => {
  const timestamp = Date.now();
  const uniqueId = createId();
  return `${timestamp}-${uniqueId}.${extension}`;
};

const isValidFileExtension = (extension: string): boolean => {
  return ALLOWED_EXTENSIONS.includes(
    extension.toLowerCase() as (typeof ALLOWED_EXTENSIONS)[number]
  );
};

const getFileType = async (
  buffer: Buffer,
  filename: string
): Promise<{
  extension: string;
  mimeType: string;
  isValid: boolean;
}> => {
  try {
    const metadata = await Sharp(buffer).metadata();

    if (!metadata.format) {
      throw new Error("Unknown format");
    }

    const extension = metadata.format.toLowerCase();
    const mimeType = MIME_TYPES[extension as keyof typeof MIME_TYPES];

    return {
      extension,
      mimeType: mimeType || "application/octet-stream",
      isValid: isValidFileExtension(extension),
    };
  } catch {
    // Fallback to file extension
    const extension = filename.split(".").pop()?.toLowerCase() || "";
    return {
      extension,
      mimeType:
        MIME_TYPES[extension as keyof typeof MIME_TYPES] ||
        "application/octet-stream",
      isValid: isValidFileExtension(extension),
    };
  }
};
// #endregion

export const POST = async (req: NextRequest) => {
  const role = await checkAuth([Role.admin, Role.content]);

  if (!role) {
    return NextResponse.json(...authError);
  }

  try {
    const { formData, error: formDataError } = await formDataReader(req);

    if (formDataError || !formData) {
      return NextResponse.json(
        { error: formDataError || "Invalid form data" },
        { status: 400 }
      );
    }

    const file = formData.get("file");
    const _path = formData.get("path");
    const fullQuality = formData.get("fullQuality") === "true";

    if (!file || typeof file === "string") {
      return NextResponse.json(
        { error: "No valid file received" },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File size exceeds maximum limit" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const { extension, mimeType, isValid } = await getFileType(
      buffer,
      file.name
    );

    if (!isValid) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }

    const optimizedBuffer = await optimizeImage(buffer, fullQuality);
    const secureFilename = generateUniqueFilename(extension);

    // combine path and filename with correct path separator
    const securePath = (_path ? _path.toString() : "tmp").replace(/\/$/, "");
    const secureFileDir = securePath
      ? `${securePath}/${secureFilename}`
      : secureFilename;

    await uploadFile(optimizedBuffer, secureFileDir, {
      ContentType: mimeType,
      CacheControl: "public, max-age=31536000",
    });

    return NextResponse.json({
      success: true,
      filename: secureFileDir,
      optimized: !fullQuality,
      mimeType,
    });
  } catch (error) {
    console.error("File upload error:", error);
    return NextResponse.json(
      { error: "Failed to process file upload" },
      { status: 500 }
    );
  }
};
