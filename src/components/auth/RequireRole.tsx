import { useAuth } from "@/hooks/useAuth";
import { resolveRouteAccess } from "@/lib/routeAccess";
import { Navigate, Outlet, useLocation } from "react-router-dom";

type RequireRoleProps = {
  allowedRoles?: readonly string[];
};

export default function RequireRole({ allowedRoles }: RequireRoleProps) {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const decision = resolveRouteAccess({
    loading,
    isAuthenticated,
    role: user?.role,
    allowedRoles,
  });

  if (decision === "loading") {
    return (
      <main className="grid min-h-screen place-items-center bg-background text-muted-foreground">
        Verificando acesso...
      </main>
    );
  }

  if (decision === "login") {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (decision === "forbidden") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}