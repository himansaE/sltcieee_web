import { uploadFile } from "@/lib/services/s3";
import path from "node:path";
import { type NextRequest, NextResponse } from "next/server";
import { formDataReader } from "@/lib/api/formDataReader";
import { checkAuth } from "@/lib/auth/server";
import { Role } from "@prisma/client";
import { authError } from "@/lib/auth/error";
import { createId } from "@paralleldrive/cuid2";

export const POST = async (req: NextRequest) => {
  const role = await checkAuth([Role.admin, Role.content]);
  if (!role) {
    return NextResponse.json(...authError);
  }

  try {
    const { formData, error: formDataError } = await formDataReader(req);

    if (formDataError || !formData) {
      return NextResponse.json(
        {
          error: formDataError || "Invalid form data",
        },
        { status: 400 }
      );
    }
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return NextResponse.json(
        {
          error: "No valid file received",
        },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = file.name.replaceAll(" ", "_");
    const fileExtension = filename.split(".").pop();

    await uploadFile(
      buffer,
      path.normalize(`upload_${createId()}.${fileExtension}`)
    );

    return NextResponse.json(
      {
        message: "Success",
        filename,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      {
        error: "File upload failed",
      },
      { status: 500 }
    );
  }
};
