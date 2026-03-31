import { type FunctionComponent, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { ClipboardCheck } from "lucide-react";
import clsx from "clsx";
import useAuthStore from "@store/useAuthStore";
// import employeeSidebarMenus from "@constants/sidebar/sidebar.employee.constant";
import HRSidebarMenus from "@/constants/sidebar/sidebar.hr.constants";
import SidebarMenuItem from "./SidebarMenuItem";
import { UserRoleType } from "@/types/user/user-role.types";
import EmployeeSidebarMenus from "@/constants/sidebar/sidebar.employee.constants";
import useUIStore from "@/store/useUIStore";

const DefaultSidebar: FunctionComponent = () => {
  const { isSidebarExpand } = useUIStore();
  const role = useAuthStore((state) => state.role);

  const menuList = useMemo(() => {
    return role === UserRoleType.HR ? HRSidebarMenus : EmployeeSidebarMenus;
  }, [role]);

  const { pathname } = useLocation();
  const pathnameSegments = pathname.split("/").slice(1);

  return (
    <aside>
      <nav
        className={clsx(
          "flex flex-col bg-slate-900 h-screen fixed top-0 left-0 z-40 transition-all duration-300 overflow-y-auto overflow-x-hidden",
          isSidebarExpand ? "w-60" : "w-18",
        )}
      >
        {/* Logo */}
        <div
          className={clsx(
            "flex items-center px-4 py-5 border-b border-white/5",
            isSidebarExpand ? "gap-3" : "justify-center",
          )}
        >
          <div className="shrink-0 w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg">
            <ClipboardCheck
              className="text-white"
              size={18}
              strokeWidth={2.5}
            />
          </div>
          {isSidebarExpand && (
            <div className="flex flex-col overflow-hidden">
              <span className="text-white font-bold text-[15px] leading-tight whitespace-nowrap">
                PT. Maju Mundur
              </span>
              <span className="text-slate-400 text-[11px] whitespace-nowrap">
                Sistem Absensi WFH
              </span>
            </div>
          )}
        </div>

        {/* Menu Items */}
        <div className="flex flex-col gap-1 p-3 flex-1 mt-1">
          {menuList.map((menu, idx) => {
            const url = menu.url.split("/").slice(1);
            const isActiveMenu = pathnameSegments[1] === url[1];

            return (
              <SidebarMenuItem
                key={`sidebar-item-${idx}`}
                {...menu}
                isActiveMenu={isActiveMenu}
                isSidebarExpand={isSidebarExpand}
                pathname={pathname}
              />
            );
          })}
        </div>

        {/* Bottom section - version */}
        {isSidebarExpand && (
          <div className="px-4 py-4 border-t border-white/5">
            <p className="text-[12px] text-slate-500 text-center">
              Developed by Syahreza Ferdian
            </p>
          </div>
        )}
      </nav>
    </aside>
  );
};

export default DefaultSidebar;
