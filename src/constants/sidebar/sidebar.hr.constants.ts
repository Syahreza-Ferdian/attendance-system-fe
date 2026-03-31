import type { SidebarMenu } from "@/types/sidebar-menu.types";

import {
  LayoutDashboard,
  ClipboardList,
  //   CalendarDays,
  //   BarChart3,
  //   Settings,
  Building2,
} from "lucide-react";

const HRSidebarMenus: SidebarMenu[] = [
  {
    icon: LayoutDashboard,
    name: "Dashboard",
    isDropdown: false,
    url: "/hr/dashboard",
  },
  {
    icon: ClipboardList,
    name: "Data Absensi",
    isDropdown: false,
    url: "/hr/attendance",
  },
  {
    icon: Building2,
    name: "Master Data",
    isDropdown: true,
    url: "/hr/master-data",
    hasSubMenu: true,
    subMenuLinks: [
      {
        subUrl: "/hr/master-data/employees",
        label: "Karyawan",
        forceShow: true,
      },
      {
        subUrl: "/hr/master-data/divisions",
        label: "Divisi",
        forceShow: true,
      },
      {
        subUrl: "/hr/master-data/positions",
        label: "Jabatan",
        forceShow: true,
      },
      {
        subUrl: "/hr/master-data/shifts",
        label: "Jadwal Kerja",
        forceShow: true,
      },
    ],
  },
];

export default HRSidebarMenus;
