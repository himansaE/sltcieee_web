import type { RouteDefinition, MatchResult, RouteParams } from "./route.types";

export class RouteMatcher {
  private static cache = new Map<string, MatchResult>();
  private static readonly paramRegex = /:([A-Za-z][A-Za-z0-9_]*)/g;

  static match(path: string, routes: RouteDefinition[]): MatchResult {
    // Check cache first
    const cached = this.cache.get(path);
    if (cached) return cached;

    const result = this.findMatch(path, routes);
    this.cache.set(path, result);
    return result;
  }

  private static findMatch(
    path: string,
    routes: RouteDefinition[]
  ): MatchResult {
    for (const route of routes) {
      const { matched, params } = this.matchRoute(path, route.pattern);
      if (matched) {
        return { matched: true, params, roles: route.roles };
      }

      if (route.children) {
        const childMatch = this.findMatch(path, route.children);
        if (childMatch.matched) {
          return childMatch;
        }
      }
    }

    return { matched: false, params: {}, roles: [] };
  }

  private static matchRoute(
    path: string,
    pattern: string
  ): { matched: boolean; params: RouteParams } {
    const paramNames: string[] = [];
    const regexPattern = pattern.replace(this.paramRegex, (_, name) => {
      paramNames.push(name);
      return "([^/]+)";
    });

    const match = path.match(new RegExp(`^${regexPattern}$`));
    if (!match) {
      return { matched: false, params: {} };
    }

    const params: RouteParams = {};
    paramNames.forEach((name, i) => {
      params[name] = match[i + 1];
    });

    return { matched: true, params };
  }
}
