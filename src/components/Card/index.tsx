import { cm } from "@lib/utils";
import type {
  CardBodyProps,
  CardHeaderProps,
  CardProps,
  CardRootProps,
  EmptyCardProps,
  StatCardProps,
} from "./card-interfaces.types";

export function Card({ children, className, noPadding }: CardProps) {
  return (
    <div className={cm("card", !noPadding && "card-body", className)}>
      {children}
    </div>
  );
}

export function CardRoot({ children, className }: CardRootProps) {
  return (
    <div className={cm("card overflow-visible", className)}>{children}</div>
  );
}

export function CardHeader({
  title,
  subtitle,
  action,
  className,
}: CardHeaderProps) {
  return (
    <div className={cm("card-header", className)}>
      <div>
        <h3 className="text-sm font-semibold text-ink">{title}</h3>
        {subtitle && (
          <p className="text-xs text-ink-tertiary mt-0.5">{subtitle}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

export function CardBody({ children, className }: CardBodyProps) {
  return <div className={cm("card-body", className)}>{children}</div>;
}

export function StatCard({
  label,
  value,
  icon,
  iconBg = "bg-primary-50",
  trend,
  className,
}: StatCardProps) {
  return (
    <div className={cm("card card-body flex items-start gap-4", className)}>
      <div
        className={cm(
          "w-11 h-11 rounded-xl flex items-center justify-center shrink-0",
          iconBg,
        )}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-ink-tertiary font-medium">{label}</p>
        <p className="text-2xl font-bold text-ink mt-0.5">{value}</p>
        {trend && (
          <p className={cm("text-xs mt-1 font-medium", "text-status-present")}>
            {trend.value}
          </p>
        )}
      </div>
    </div>
  );
}

export function EmptyCard({
  icon,
  title = "Tidak ada data",
  description,
  action,
}: EmptyCardProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      {icon && (
        <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4 text-slate-400">
          {icon}
        </div>
      )}
      <p className="text-sm font-semibold text-ink">{title}</p>
      {description && (
        <p className="text-xs text-ink-tertiary mt-1 max-w-xs">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
