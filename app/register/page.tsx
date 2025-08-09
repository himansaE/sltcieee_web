import type { Metadata } from "next";
import RegisterClient from "./RegisterClient";

export const metadata: Metadata = {
  title: "Admin Register",
  description: "Create an admin account for IEEE SLTC",
};

export default function Page() {
  return <RegisterClient />;
}
