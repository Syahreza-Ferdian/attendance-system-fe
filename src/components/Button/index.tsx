import { cm } from "@lib/utils";
import { Loader2 } from "lucide-react";
import { sizes, variants, type ButtonProps } from "./button-interfaces.types";

export default function Button({
  variant = "primary",
  size = "md",
  loading = false,
  leftIcon,
  rightIcon,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cm(
        "cursor-pointer inline-flex items-center justify-center font-medium transition-all duration-150",
        "focus:outline-none focus:ring-4 focus:ring-offset-4",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 size={14} className="animate-spin shrink-0" />
      ) : (
        leftIcon && <span className="shrink-0">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!loading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
}
