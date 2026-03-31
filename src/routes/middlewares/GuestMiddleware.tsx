import useAuthStore from "@/store/useAuthStore";
import { UserRoleType } from "@/types/user/user-role.types";
import type React from "react";
import { Navigate } from "react-router-dom";

interface GuestMiddlewareProps {
  children: React.ReactNode;
}

export default function GuestMiddleware({ children }: GuestMiddlewareProps) {
  const { isAuthenticated, role } = useAuthStore();

  if (isAuthenticated) {
    const dashboardPath =
      role === UserRoleType.HR ? "/hr/dashboard" : "/employee/dashboard";
    return <Navigate to={dashboardPath} replace />;
  }

  return <>{children}</>;
}
