import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { cm } from "@lib/utils";
import type { BreadcrumbProps } from "./breadcrumb-interfaces.types";

export default function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={cm("flex items-center", className)}>
      <ol className="flex items-center flex-wrap gap-1">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={idx} className="flex items-center gap-1">
              {idx > 0 && (
                <ChevronRight size={13} className="text-slate-300 shrink-0" />
              )}
              {!isLast && item.href ? (
                <Link
                  to={item.href}
                  className="text-xs text-ink-tertiary hover:text-ink transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={cm(
                    "text-xs",
                    isLast ? "text-ink font-medium" : "text-ink-tertiary",
                  )}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
