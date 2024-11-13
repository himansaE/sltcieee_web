// utils/env/shared.ts
export const isClient = typeof window !== "undefined";

export const validateEnvValue = (
  name: string,
  value: string | undefined,
  required: boolean
) => {
  if (!value && required) {
    console.error(`Environment variable "${name}" is required`);
  }
};
