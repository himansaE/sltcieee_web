import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ClientEnv } from "./env/client";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getImageUrl = (url: string) => {
  return `${ClientEnv.R2.PUBLIC_URL}/${url}`;
};

export const inDevEnvironment =
  !!process && process.env.NODE_ENV === "development";

export const slugify = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/&/g, "-and-") // Replace & with 'and'
    .replace(/[^\w\-]+/g, "") // Remove all non-word characters
    .replace(/\-\-+/g, "-"); // Replace multiple - with single -
};
