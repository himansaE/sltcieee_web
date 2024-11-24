import { AdminSideNav } from "@/features/dashboard/layouts/sidenav";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AdminSideNav>
      <div className="p-4">{children}</div>
    </AdminSideNav>
  );
}
