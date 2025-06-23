import { Wix_Madefor_Display } from "next/font/google";
import { Poppins } from "next/font/google";
export const wixMadeforDisplayFont = Wix_Madefor_Display({
  weight: ["400", "600", "800"],
  variable: "--font-wix-madefor-display",
  subsets: ["latin"],
});

export const poppinsFont = Poppins({
  weight: ["300", "400", "600", "700", "800", "900"],
  variable: "--font-poppins",
  subsets: ["latin"],
});
