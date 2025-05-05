import { Metadata } from "next";
import { UsersPage } from "@/features/users/components/UsersPage";
import { WithAuth } from "@/components/withAuth";
import { Role } from "@prisma/client";

export const metadata: Metadata = {
  title: "User Management | IEEE SLTC Admin",
  description:
    "Manage users, roles, and permissions in the IEEE SLTC admin dashboard.",
};

export const dynamic = "force-dynamic";

async function UsersManagementPage() {
  return <UsersPage />;
}

export default WithAuth(UsersManagementPage, [Role.admin]);
