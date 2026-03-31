import { cm } from "@lib/utils";
import {
  attendanceConfig,
  genericVariants,
  type AttendanceBadgeProps,
  type BadgeProps,
  type WorkScheduleBadgeProps,
} from "./badge-interfaces.types";
import { WORK_SCHEDULE_DAYS_SHORT_LABEL } from "@/types/work-schedule/work-schedule.types";

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

export default function WorkScheduleDayBadge({
  days,
  max = 3,
}: WorkScheduleBadgeProps) {
  if (!days || days.length === 0) {
    return <span className="text-xs text-ink-tertiary italic">—</span>;
  }

  const sorted = [...days].sort((a, b) => a.dayOfWeek - b.dayOfWeek);
  const shown = sorted.slice(0, max);
  const rest = sorted.length - shown.length;

  return (
    <div
      className="flex items-center gap-1 flex-wrap"
      title={sorted
        .map((d) => WORK_SCHEDULE_DAYS_SHORT_LABEL[d.dayOfWeek])
        .join(", ")}
    >
      {shown.map((d) => {
        const isWeekend = d.dayOfWeek === 0 || d.dayOfWeek === 6;
        return (
          <span
            key={d.id}
            className={cm(
              "inline-flex items-center justify-center w-10 h-8 rounded-lg text-[14px] font-bold",
              isWeekend
                ? "bg-amber-50 text-amber-600"
                : "bg-primary-50 text-primary-700",
            )}
          >
            {WORK_SCHEDULE_DAYS_SHORT_LABEL[d.dayOfWeek]}
          </span>
        );
      })}
      {rest > 0 && (
        <span className="text-[10px] text-ink-tertiary font-medium">
          +{rest}
        </span>
      )}
    </div>
  );
}
