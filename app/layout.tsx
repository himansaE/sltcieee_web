import type { Metadata } from "next";
import "./globals.css";
import { figtreeFont, wixMadeforDisplayFont } from "@/lib/fonts";
import ReactQueryProvider from "@/lib/query/queryProvider";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: {
    default: "IEEE SLTC | Student Branch",
    template: "%s | IEEE SLTC",
  },
  description:
    "Official website and admin for IEEE Student Branch - SLTC. Manage blogs, events, units, and content.",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${wixMadeforDisplayFont.variable} ${figtreeFont.variable} antialiased  font-secondary`}
      >
        <ReactQueryProvider>{children}</ReactQueryProvider>
        <Toaster />
      </body>
    </html>
  );
}
