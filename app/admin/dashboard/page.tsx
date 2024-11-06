// import { WithAuth } from "@/components/withAuth";
// import { Role } from "@prisma/client";
// import type { Metadata } from "next/types";

// const AdminDashBoard = () => {
//   return (
//     <div>
//       <h1 className="py-5">Admin Dashboard</h1>
//     </div>
//   );
// };

// export default WithAuth(AdminDashBoard, [Role.admin, Role.content]);

// export const metadata: Metadata = {
//   title: "Dashboard",
//   description: "Admin dashboard",
// };

export default function Dashboard() {
  return (
    <div>
      <h1 className="py-5">Dashboard</h1>
    </div>
  );
}
