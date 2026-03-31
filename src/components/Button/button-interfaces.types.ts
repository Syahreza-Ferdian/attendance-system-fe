import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "outline";
type Size = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children: ReactNode;
}

export const variants: Record<Variant, string> = {
  primary:
    "bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500/30 shadow-sm",
  secondary: "bg-slate-100 text-ink hover:bg-slate-200 focus:ring-slate-400/30",
  ghost:
    "bg-transparent text-ink-secondary hover:bg-slate-100 focus:ring-slate-400/30",
  danger:
    "bg-red-500 text-white hover:bg-red-600 focus:ring-red-400/30 shadow-sm",
  outline:
    "bg-white border border-slate-200 text-ink hover:bg-slate-50 focus:ring-slate-400/30 shadow-sm",
};

export const sizes: Record<Size, string> = {
  sm: "px-3 py-1.5 text-xs rounded-lg gap-1.5",
  md: "px-4 py-2.5 text-sm rounded-xl gap-2",
  lg: "px-5 py-3 text-sm rounded-xl gap-2.5",
};
