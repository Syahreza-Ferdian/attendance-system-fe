import type { SidebarMenu } from "@/types/sidebar-menu.types";
import { LayoutDashboard } from "lucide-react";

const EmployeeSidebarMenus: SidebarMenu[] = [
  {
    icon: LayoutDashboard,
    name: "Dashboard",
    isDropdown: false,
    url: "/employee/dashboard",
  },
];

export default EmployeeSidebarMenus;
