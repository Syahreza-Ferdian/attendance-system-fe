import type { ReactNode } from "react";

export interface CardProps {
  children: ReactNode;
  className?: string;
  noPadding?: boolean;
}

export interface CardRootProps {
  children: ReactNode;
  className?: string;
}

export interface CardHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
}

export interface CardBodyProps {
  children: ReactNode;
  className?: string;
}

// Stat Card
export interface StatCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  iconBg?: string;
  trend?: {
    value: string;
  };
  className?: string;
}

export interface EmptyCardProps {
  icon?: ReactNode;
  title?: string;
  description?: string;
  action?: ReactNode;
}
