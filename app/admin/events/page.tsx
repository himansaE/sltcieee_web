import { WithAuth } from "@/components/withAuth";
import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";

const AdminEventsPage = async () => {
  const events = await prisma.event.findMany();
  console.log(events);
  return <></>;
};

export default WithAuth(AdminEventsPage, [Role.admin, Role.content]);
