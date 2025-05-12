import { Metadata } from "next";
import { UsersPage } from "@/features/users/components/UsersPage";

export const metadata: Metadata = {
  title: "User Management | IEEE SLTC Admin",
  description:
    "Manage users, roles, and permissions in the IEEE SLTC admin dashboard.",
};

function UsersManagementPage() {
  return <UsersPage />;
}

// export default WithAuth(UsersManagementPage, [Role.admin]);
export default UsersManagementPage;
