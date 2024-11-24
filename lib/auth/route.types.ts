import type { Role } from "@prisma/client";

export type RouteParams = Record<string, string>;

export interface RouteDefinition {
  pattern: string;
  roles: Role[];
  children?: RouteDefinition[];
}

export interface MatchResult {
  matched: boolean;
  params: RouteParams;
  roles: Role[];
}
