import { AuthLayout } from "@/layouts";
import GuestMiddleware from "./middlewares/GuestMiddleware";
import LoginPage from "@/pages/auth/LoginPage";

export default [
  {
    path: "/",
    element: (
      <GuestMiddleware>
        <AuthLayout />
      </GuestMiddleware>
    ),
    children: [{ path: "login", element: <LoginPage /> }],
  },
];
