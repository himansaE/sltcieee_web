const getEnvVariable = (name: string, fallback?: string): string => {
  const value = process.env[name] ?? fallback;
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

export const ACCOUNT_ID = getEnvVariable(
  "NEW_R2_ACCOUNT_ID",
  "default_account_id"
);
export const ACCESS_KEY_ID = getEnvVariable(
  "NEW_R2_ACCESS_KEY_ID",
  "default_access_key_id"
);
export const SECRET_ACCESS_KEY = getEnvVariable(
  "NEW_R2_SECRET_ACCESS_KEY",
  "default_secret_access_key"
);
export const BUCKET_NAME = getEnvVariable(
  "NEW_R2_BUCKET_NAME",
  "default_bucket_name"
);
