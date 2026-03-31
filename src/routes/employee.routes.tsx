import { Navigate } from "react-router-dom";
import DefaultLayout from "@layouts/DefaultLayout";
import AuthMiddleware from "./middlewares/AuthMiddleware";
import { UserRoleType } from "@/types/user/user-role.types";
import EmployeeDashboardPage from "@/pages/employee/DashboardPage";

export default [
  {
    path: "/employee",
    element: (
      <AuthMiddleware allowedRoles={[UserRoleType.EMPLOYEE, UserRoleType.HR]}>
        <DefaultLayout />
      </AuthMiddleware>
    ),
    children: [
      { index: true, element: <Navigate to="dashboard" /> },
      {
        path: "dashboard",
        element: <EmployeeDashboardPage />,
      },
    ],
  },
];
