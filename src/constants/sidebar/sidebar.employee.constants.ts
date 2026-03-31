import type { SidebarMenu } from "@/types/sidebar-menu.types";
import { LayoutDashboard, User } from "lucide-react";

const EmployeeSidebarMenus: SidebarMenu[] = [
  {
    icon: LayoutDashboard,
    name: "Dashboard",
    isDropdown: false,
    url: "/employee/dashboard",
  },
];

export default EmployeeSidebarMenus;
