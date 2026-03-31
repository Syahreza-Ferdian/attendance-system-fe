import type { ReactNode } from "react";
import type { BreadcrumbItem } from "../Breadcrumb/breadcrumb-interfaces.types";

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  action?: ReactNode;
}
