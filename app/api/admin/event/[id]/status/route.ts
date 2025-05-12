import { checkAuth } from "@/lib/auth/server";
import { Role, EventStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { inDevEnvironment } from "@/lib/utils";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const role = await checkAuth([Role.admin]);
  if (!role) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { status } = await req.json();

    if (!Object.values(EventStatus).includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    if (inDevEnvironment) {
      console.log("Event status update:", {
        status,
        eventId: params.id,
      });
      const event = await prisma.event.findUnique({
        where: { id: params.id },
      });
      if (!event) {
        return NextResponse.json({ error: "Event not found" }, { status: 404 });
      }
      if (event.status === status) {
        return NextResponse.json(
          { error: "Event status is already set to this value" },
          { status: 400 }
        );
      }
    }

    const updatedEvent = await prisma.event.update({
      where: { id: params.id },
      data: { status },
    });

    return NextResponse.json(updatedEvent);
  } catch (error) {
    console.error("Error updating event status:", error);
    return NextResponse.json(
      { error: "Failed to update event status" },
      { status: 500 }
    );
  }
}
