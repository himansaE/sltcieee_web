import type { Prisma } from "@prisma/client";

export type Event = Prisma.EventGetPayload<{
  select: { [K in keyof Required<Prisma.EventSelect>]: true };
}>;
