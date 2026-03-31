import { Outlet } from "react-router-dom";
import DefaultSidebar from "./DefaultSidebar";
import DefaultNavbar from "./DefaultNavbar";
import useUIStore from "@/store/useUIStore";

export default function DefaultLayout() {
  const isSidebarExpand = useUIStore((state) => state.isSidebarExpand);

  return (
    <div className="main-layout bg-surface-secondary font-sans min-h-screen">
      <div className="flex">
        <DefaultSidebar />
        <div
          className={`grow transition-all duration-300 ${
            isSidebarExpand ? "ml-60" : "ml-18"
          }`}
        >
          <DefaultNavbar />
          <main className="p-6 animate-fade-in">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
