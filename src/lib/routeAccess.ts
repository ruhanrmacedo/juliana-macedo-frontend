export type RouteAccessDecision = "loading" | "login" | "forbidden" | "allow";

type RouteAccessInput = {
  loading: boolean;
  isAuthenticated: boolean;
  role?: string;
  allowedRoles?: readonly string[];
};

export function resolveRouteAccess({
  loading,
  isAuthenticated,
  role,
  allowedRoles,
}: RouteAccessInput): RouteAccessDecision {
  if (loading) return "loading";
  if (!isAuthenticated) return "login";
  if (allowedRoles?.length && (!role || !allowedRoles.includes(role))) {
    return "forbidden";
  }
  return "allow";
}