import type { Metadata } from "next";
import RoundTablePage from "@/features/roundTable/RoundTablePage";

export const metadata: Metadata = {
  title: "Round Table",
  description: "Manage round table member photos",
};

export default function Page() {
  return <RoundTablePage />;
}
