const getEnvVariable = (name: string, fallback?: string): string => {
  const value = process.env[name] ?? fallback;
  if (!value) {
    console.error(`Environment variable ${name} is not set`);
    return fallback ?? "";
  }
  return value;
};

export const ACCOUNT_ID = getEnvVariable("R2_ACCOUNT_ID");
export const ACCESS_KEY_ID = getEnvVariable("R2_ACCESS_KEY_ID");
export const SECRET_ACCESS_KEY = getEnvVariable("R2_SECRET_ACCESS_KEY");
export const BUCKET_NAME = getEnvVariable("R2_BUCKET_NAME");

export const R2_ENDPOINT = getEnvVariable("R2_ENDPOINT");

// backendBaseUrl
export const BACKEND_BASE_URL = getEnvVariable("BACKEND_BASE_URL");
