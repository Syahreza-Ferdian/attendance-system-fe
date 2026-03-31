import { cm } from "@lib/utils";
import {
  attendanceConfig,
  genericVariants,
  type AttendanceBadgeProps,
  type BadgeProps,
} from "./badge-interfaces.types";

export function AttendanceBadge({ status, className }: AttendanceBadgeProps) {
  const config = attendanceConfig[status];
  return (
    <span className={cm("badge", config.className, className)}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {config.label}
    </span>
  );
}

export function Badge({
  children,
  variant = "default",
  className,
}: BadgeProps) {
  return (
    <span className={cm("badge", genericVariants[variant], className)}>
      {children}
    </span>
  );
}
