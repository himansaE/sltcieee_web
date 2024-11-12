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

export const uploadFile = async (file: Buffer, key: string) => {
  try {
    await s3Client.send(
      new PutObjectCommand({
        Bucket: ServerEnv.R2.BUCKET_NAME,
        Key: key,
        Body: file,
        ACL: "public-read",
      })
    );
  } catch (error) {
    console.error("Error uploading file: ", error);
    throw error;
  }
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
