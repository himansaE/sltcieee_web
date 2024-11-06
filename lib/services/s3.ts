import {
  ACCESS_KEY_ID,
  ACCOUNT_ID,
  BUCKET_NAME,
  SECRET_ACCESS_KEY,
} from "../envs";
import * as AWS from "aws-sdk";

const s3Client = new AWS.S3({
  endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
  accessKeyId: ACCESS_KEY_ID,
  secretAccessKey: SECRET_ACCESS_KEY, // Use the secret key directly
  signatureVersion: "v4",
  region: "auto", // Cloudflare R2 doesn't use regions, but this is required by the SDK
});

export const uploadFile = async (file: Buffer, key: string) => {
  const params = {
    Bucket: BUCKET_NAME,
    Key: key,
    Body: file,
  };

  return s3Client.upload(params).promise();
};
