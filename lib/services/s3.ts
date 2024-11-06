import {
  ACCESS_KEY_ID,
  BUCKET_NAME,
  R2_ENDPOINT,
  SECRET_ACCESS_KEY,
} from "../envs";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: "auto",
  endpoint: R2_ENDPOINT,
  credentials: {
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
  },
  forcePathStyle: true,
});

export const uploadFile = async (file: Buffer, key: string) => {
  try {
    await s3Client.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
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
