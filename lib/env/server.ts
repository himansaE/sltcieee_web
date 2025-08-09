// utils/env/server.ts
import type { EnvConfig, EnvVar } from "@/types/env";
import { isClient, validateEnvValue } from "./shared";

const getServerVariable = (name: EnvVar, config: EnvConfig = {}): string => {
  if (isClient) {
    throw new Error(
      `Cannot access server-side env variable "${name}" on the client`
    );
  }
  const { required = true, fallback = "" } = config;
  const value = process.env[name] ?? fallback;
  validateEnvValue(name, value, required);
  return value;
};

export const ServerEnv = {
  APP: {
    URL: getServerVariable("APP_URL"),
  },
  R2: {
    ACCOUNT_ID: getServerVariable("R2_ACCOUNT_ID"),
    ACCESS_KEY_ID: getServerVariable("R2_ACCESS_KEY_ID"),
    SECRET_ACCESS_KEY: getServerVariable("R2_SECRET_ACCESS_KEY"),
    BUCKET_NAME: getServerVariable("R2_BUCKET_NAME"),
    ENDPOINT: getServerVariable("R2_ENDPOINT"),
  },
  AUTH: {
    INTERNAL_TOKEN: getServerVariable("INTERNAL_AUTH_TOKEN"),
  },
  GMAIL: {
    USER: getServerVariable("GMAIL_USER"),
    CLIENT_ID: getServerVariable("GMAIL_CLIENT_ID"),
    CLIENT_SECRET: getServerVariable("GMAIL_CLIENT_SECRET"),
    REFRESH_TOKEN: getServerVariable("GMAIL_REFRESH_TOKEN"),
  },
} as const;
