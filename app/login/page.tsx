import type { Metadata } from "next";
import LoginClient from "./LoginClient";

export const metadata: Metadata = {
  title: "Admin Login",
  description: "Log in to the IEEE SLTC admin dashboard",
};

export default function Page() {
  return <LoginClient />;
}
