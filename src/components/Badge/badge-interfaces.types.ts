import type { AttendanceStatus } from "@/types/attendance/attendance.types";

// khusus badge untuk attendance status
export interface AttendanceBadgeProps {
  status: AttendanceStatus;
  className?: string;
}
export const attendanceConfig: Record<
  AttendanceStatus,
  { label: string; className: string }
> = {
  PRESENT: { label: "Hadir tepat waktu", className: "badge-present" },
  LATE: { label: "Terlambat", className: "badge-late" },
};

// badge umum
export interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "error" | "warning" | "info";
  className?: string;
}

export const genericVariants = {
  default: "bg-slate-100 text-slate-600",
  success: "bg-emerald-50 text-emerald-600",
  error: "bg-red-50 text-red-500",
  warning: "bg-amber-50 text-amber-600",
  info: "bg-blue-50 text-blue-600",
};
