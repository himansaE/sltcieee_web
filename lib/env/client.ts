// utils/env/client.ts
export const ClientEnv = {
  R2: {
    PUBLIC_URL: process.env.NEXT_PUBLIC_R2_PUBLIC_ENDPOINT,
  },
  BACKEND: {
    BASE_URL: process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:3000",
  },
} as const;
