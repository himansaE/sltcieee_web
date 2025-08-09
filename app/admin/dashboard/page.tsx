export const dynamic = "force-dynamic";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "IEEE SLTC Admin Dashboard",
};

export default function Dashboard() {
  return (
    <div>
      <h1 className="py-5">Dashboard</h1>
    </div>
  );
}
