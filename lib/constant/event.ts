import { EventStatus, EventType } from "@prisma/client";

type EventTypeMapping = {
  readonly [K in EventType]: string;
};

export const eventTypeNames: EventTypeMapping = {
  [EventType.PUBLIC]: "Public",
  [EventType.IEEE_MEMBERS]: "IEEE Members",
  [EventType.INTER_UNIVERSITY]: "Inter-University",
  [EventType.SLTC_ONLY]: "SLTC Undergraduates",
};

type EventStatusMapping = {
  readonly [K in EventStatus]: string;
};

export const eventStatusNames: EventStatusMapping = {
  [EventStatus.draft]: "Draft",
  [EventStatus.comingSoon]: "Coming Soon",
  [EventStatus.dateAnnounced]: "Date Announced",
  [EventStatus.registrationOpen]: "Registration Open",
  [EventStatus.registrationClosed]: "Registration Closed",
  [EventStatus.ongoing]: "Ongoing",
  [EventStatus.completed]: "Completed",
};
