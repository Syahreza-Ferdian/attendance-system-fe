import type React from "react";

export interface SidebarMenu {
  icon: React.ElementType;
  name: string;
  isDropdown: boolean;
  url: string;
  hasSubMenu?: boolean;
  subMenuLinks?: SubMenuLinks[];
}

export interface SubMenuLinks {
  subUrl: string;
  label: string;
  forceShow?: boolean;
}
