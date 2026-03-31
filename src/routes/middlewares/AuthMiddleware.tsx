import useAuthStore from "@/store/useAuthStore";
import { UserRoleType } from "@/types/user/user-role.types";
import { type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

interface AuthMiddlewareProps {
  children: ReactNode;
  allowedRoles?: UserRoleType[];
}

export default function AuthMiddleware({
  children,
  allowedRoles,
}: AuthMiddlewareProps) {
  const { isAuthenticated, role } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    // Redirect to appropriate dashboard based on role
    const dashboardPath =
      role === UserRoleType.HR ? "/hr/dashboard" : "/employee/dashboard";
    return <Navigate to={dashboardPath} replace />;
  }

  return <>{children}</>;
}
