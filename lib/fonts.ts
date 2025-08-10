import { Wix_Madefor_Display } from "next/font/google";
import { Figtree } from "next/font/google";
export const wixMadeforDisplayFont = Wix_Madefor_Display({
  weight: ["400", "600", "800"],
  variable: "--font-wix-madefor-display",
  subsets: ["latin"],
});

export const figtreeFont = Figtree({
  weight: ["300", "400", "600", "700", "800", "900"],
  variable: "--font-figtree",
  subsets: ["latin"],
});
