// utils/env/client.ts
export const ClientEnv = {
  R2: {
    PUBLIC_URL: process.env.NEXT_PUBLIC_R2_PUBLIC_ENDPOINT,
  },
  BACKEND: {
    BASE_URL: process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:3000",
    getCurrentUrl: (currPath: string) => {
      const url = new URL(currPath, ClientEnv.BACKEND.BASE_URL);
      return url.toString();
    },
  },
} as const;
