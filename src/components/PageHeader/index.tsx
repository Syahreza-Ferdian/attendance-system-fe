import Breadcrumb from "../Breadcrumb";
import type { PageHeaderProps } from "./page-header-interfaces.types";

export default function PageHeader({
  title,
  subtitle,
  breadcrumbs,
  action,
}: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <Breadcrumb items={breadcrumbs} className="mb-2" />
        )}
        <h1 className="text-xl font-bold text-ink">{title}</h1>
        {subtitle && (
          <p className="text-sm text-ink-tertiary mt-0.5">{subtitle}</p>
        )}
      </div>
      {action && (
        <div className="flex items-center gap-2 shrink-0">{action}</div>
      )}
    </div>
  );
}
