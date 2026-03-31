import { Navigate } from "react-router-dom";
import DefaultLayout from "@layouts/DefaultLayout";
import AuthMiddleware from "./middlewares/AuthMiddleware";
import { UserRoleType } from "@/types/user/user-role.types";
import AdminDashboardPage from "@/pages/admin/dashboard/DashboardPage";
import EmployeePage from "@/pages/admin/employee/EmployeePage";
import EmployeeCreatePage from "@/pages/admin/employee/EmployeeCreatePage";
import AttendancePage from "@/pages/admin/attendance/AttendancePage";
import AttendanceDetailPage from "@/pages/admin/attendance/AttendanceDetailPage";
import DivisionPage from "@/pages/admin/division/DivisionPage";
import DivisionCreatePage from "@/pages/admin/division/DivisionCreatePage";
import PositionPage from "@/pages/admin/position/PositionPage";
import PositionCreatePage from "@/pages/admin/position/PositionCreatePage";

export default [
  {
    path: "/hr",
    element: (
      <AuthMiddleware allowedRoles={[UserRoleType.HR]}>
        <DefaultLayout />
      </AuthMiddleware>
    ),
    children: [
      { index: true, element: <Navigate to="dashboard" /> },
      { path: "dashboard", element: <AdminDashboardPage /> },
      { path: "attendance", element: <AttendancePage /> },
      {
        path: "attendance/:attendanceId/detail",
        element: <AttendanceDetailPage />,
      },
      { path: "master-data/employees", element: <EmployeePage /> },
      {
        path: "master-data/employees/create",
        element: <EmployeeCreatePage />,
      },
      {
        path: "master-data/employees/:userId/edit",
        element: <EmployeeCreatePage />,
      },
      {
        path: "master-data/divisions",
        element: <DivisionPage />,
      },
      {
        path: "master-data/divisions/create",
        element: <DivisionCreatePage />,
      },
      {
        path: "master-data/divisions/:divisionId/edit",
        element: <DivisionCreatePage />,
      },
      {
        path: "master-data/positions",
        element: <PositionPage />,
      },
      {
        path: "master-data/positions/create",
        element: <PositionCreatePage />,
      },
      {
        path: "master-data/positions/:positionId/edit",
        element: <PositionCreatePage />,
      },
    ],
  },
];
