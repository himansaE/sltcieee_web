import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ClientEnv } from "./env/client";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getImageUrl = (url: string) => {
  return `${ClientEnv.R2.PUBLIC_URL}/${url}`;
};
