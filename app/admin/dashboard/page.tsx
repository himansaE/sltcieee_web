import { WithAuth } from "@/components/withAuth";
import { Role } from "@prisma/client";

const AdminDashBoard = () => {
  return (
    <div>
      <h1>Admin Dashboard</h1>
    </div>
  );
};

export default WithAuth(AdminDashBoard, [Role.admin, Role.content]);
