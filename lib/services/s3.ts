import {
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { ServerEnv } from "../env/server";

const s3Client = new S3Client({
  region: "auto",
  endpoint: ServerEnv.R2.ENDPOINT,
  credentials: {
    accessKeyId: ServerEnv.R2.ACCESS_KEY_ID,
    secretAccessKey: ServerEnv.R2.SECRET_ACCESS_KEY,
  },
  forcePathStyle: true,
});

export const uploadFile = async (
  buffer: Buffer,
  key: string,
  options?: {
    ContentType?: string;
    CacheControl?: string;
  }
) => {
  const command = new PutObjectCommand({
    Bucket: ServerEnv.R2.BUCKET_NAME,
    Key: key,
    Body: buffer,
    ...options,
  });

  return s3Client.send(command);
};

export const fileExists = async (key: string): Promise<boolean> => {
  try {
    await s3Client.send(
      new HeadObjectCommand({
        Bucket: ServerEnv.R2.BUCKET_NAME,
        Key: key,
      })
    );
    return true;
  } catch {
    return false;
  }
};
