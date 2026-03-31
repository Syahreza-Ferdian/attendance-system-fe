import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import clsx from "clsx";
import type { SidebarMenu } from "@/types/sidebar-menu.types";

interface SidebarMenuItemProps extends SidebarMenu {
  isActiveMenu: boolean;
  isSidebarExpand: boolean;
  pathname: string;
}

function SidebarMenuItem({
  icon: Icon,
  name,
  url,
  hasSubMenu,
  subMenuLinks,
  isActiveMenu,
  isSidebarExpand,
  pathname,
}: SidebarMenuItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(isActiveMenu);
  }, [isActiveMenu]);

  if (hasSubMenu && subMenuLinks) {
    return (
      <div>
        <button
          onClick={() => setIsOpen((p) => !p)}
          className={clsx(
            "sidebar-link w-full",
            isActiveMenu && "bg-white/8 text-white",
          )}
          title={!isSidebarExpand ? name : undefined}
        >
          <Icon size={18} className="shrink-0" />
          {isSidebarExpand && (
            <>
              <span className="flex-1 text-left truncate">{name}</span>
              <ChevronDown
                size={15}
                className={clsx(
                  "shrink-0 transition-transform duration-200",
                  isOpen && "rotate-180",
                )}
              />
            </>
          )}
        </button>

        {isOpen && isSidebarExpand && (
          <div className="mt-1 ml-4 pl-3 border-l border-white/10 flex flex-col gap-0.5">
            {subMenuLinks.map((sub, idx) => {
              const isSubActive =
                pathname === sub.subUrl ||
                pathname.startsWith(sub.subUrl + "/");
              return (
                <Link
                  key={idx}
                  to={sub.subUrl}
                  className={clsx(
                    "sidebar-link-submenu",
                    isSubActive && "active",
                  )}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60 shrink-0" />
                  {sub.label}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      to={url}
      className={clsx("sidebar-link", isActiveMenu && "active")}
      title={!isSidebarExpand ? name : undefined}
    >
      <Icon size={18} className="shrink-0" />
      {isSidebarExpand && <span className="truncate">{name}</span>}
    </Link>
  );
}

export default React.memo(SidebarMenuItem);
