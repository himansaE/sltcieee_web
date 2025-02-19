import { EventType } from "@prisma/client";

type EventTypeMapping = {
  readonly [K in EventType]: string;
};

export const eventTypeNames: EventTypeMapping = {
  [EventType.PUBLIC]: "Public",
  [EventType.IEEE_MEMBERS]: "IEEE Members",
  [EventType.INTER_UNIVERSITY]: "Inter-University",
  [EventType.SLTC_ONLY]: "SLTC Undergraduates",
};
