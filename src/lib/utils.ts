import config from "@/constants/config";
import { type ClassValue, clsx } from "clsx";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

// class merge
export function cm(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(
  dateStr: string | Date,
  opts?: Intl.DateTimeFormatOptions,
): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    ...opts,
  });
}

export function formatTime(dateTimeStr: string): string {
  const date = new Date(dateTimeStr);
  return date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Jakarta",
  });
}

export function formatDateTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export function cleanObject<T extends Record<string, unknown>>(
  obj: T,
): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ([_, v]) => v !== undefined && v !== null && v !== "",
    ),
  ) as Partial<T>;
}

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export type JSONValue =
  | string
  | number
  | boolean
  | null
  | File
  | JSONValue[]
  | { [key: string]: JSONValue };

export const jsonToFormData = (
  json: { [key: string]: JSONValue },
  formData: FormData = new FormData(),
  parentKey: string = "",
): FormData => {
  Object.keys(json).forEach((key) => {
    const value = json[key];
    const formKey = parentKey ? `${parentKey}[${key}]` : key;

    if (value instanceof File) {
      formData.append(formKey, value);
    } else if (value && typeof value === "object") {
      if (Array.isArray(value)) {
        value.forEach((item, index) => {
          const arrayKey = `${formKey}[${index}]`;
          if (typeof item === "object" && !(item instanceof File)) {
            jsonToFormData(
              item as { [key: string]: JSONValue },
              formData,
              arrayKey,
            );
          } else if (item !== null && item !== undefined) {
            formData.append(arrayKey, item as string | Blob);
          }
        });
      } else {
        jsonToFormData(
          value as { [key: string]: JSONValue },
          formData,
          formKey,
        );
      }
    } else if (value !== null && value !== undefined) {
      formData.append(formKey, value as string | Blob);
    }
  });

  return formData;
};

export function capitalizeFirstLetter(str: string): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function getImageUrl(path: string): string {
  const baseUrl = config.BASE_API_URL || "";
  return `${baseUrl}${path}`;
}
