import React, { forwardRef } from "react";
import { cm } from "@lib/utils";
import type {
  CustomLabelProps,
  InputProps,
  SelectProps,
  TextareaProps,
} from "./form-interfaces.types";
import type { Props } from "react-select";
import ReactSelect from "react-select";

export const Input = React.memo(
  forwardRef<HTMLInputElement, InputProps>(
    (
      {
        label,
        error,
        leftIcon,
        rightIcon,
        rightElement,
        className,
        id,
        ...props
      },
      ref,
    ) => {
      return (
        <div className="w-full">
          {label && (
            <label htmlFor={id} className="form-label">
              {label}
            </label>
          )}
          <div className="relative">
            {leftIcon && (
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-ink-tertiary">
                {leftIcon}
              </div>
            )}
            <input
              ref={ref}
              id={id}
              className={cm(
                "form-input",
                leftIcon && "pl-9",
                rightIcon && "pr-9",
                error && "form-input-error",
                className,
              )}
              {...props}
            />
            {rightIcon && (
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-ink-tertiary">
                {rightIcon}
              </div>
            )}

            {rightElement && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {rightElement}
              </div>
            )}
          </div>
          {error && <p className="form-error">{error}</p>}
        </div>
      );
    },
  ),
);
Input.displayName = "Input";

export const Select = React.memo(
  forwardRef<HTMLSelectElement, SelectProps>(
    (
      { leftIcon, label, error, options, placeholder, className, id, ...props },
      ref,
    ) => {
      return (
        <div className="w-full">
          {label && (
            <label htmlFor={id} className="form-label">
              {label}
            </label>
          )}

          {leftIcon && (
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-ink-tertiary">
              {leftIcon}
            </div>
          )}

          <select
            ref={ref}
            id={id}
            className={cm(
              "form-input appearance-none",
              error && "form-input-error",
              className,
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {error && <p className="form-error">{error}</p>}
        </div>
      );
    },
  ),
);
Select.displayName = "Select";

export const Textarea = React.memo(
  forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ label, error, className, id, ...props }, ref) => {
      return (
        <div className="w-full">
          {label && (
            <label htmlFor={id} className="form-label">
              {label}
            </label>
          )}
          <textarea
            ref={ref}
            id={id}
            className={cm(
              "form-input resize-none",
              error && "form-input-error",
              className,
            )}
            {...props}
          />
          {error && <p className="form-error">{error}</p>}
        </div>
      );
    },
  ),
);
Textarea.displayName = "Textarea";

export const CustomLabel = React.memo(
  forwardRef<HTMLLabelElement, CustomLabelProps>(
    ({ label, required, error, hint, children, ...props }, ref) => {
      return (
        <div className="flex flex-col gap-1.5">
          <label
            className="text-sm font-medium text-ink-secondary"
            ref={ref}
            {...props}
          >
            {label}
            {required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
          {children}
          {hint && !error && (
            <p className="text-xs text-ink-tertiary">{hint}</p>
          )}
          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
      );
    },
  ),
);
CustomLabel.displayName = "CustomLabel";

type Option<T = any> = {
  label: string;
  value: T;
};

type CustomSelectProps<T> = Props<Option<T>, false>;

export default function CustomSelect<T = any>(props: CustomSelectProps<T>) {
  return (
    <ReactSelect
      {...props}
      styles={{
        control: (base, state) => ({
          ...base,
          height: 48,
          minHeight: 48,
          borderRadius: "12px",
          borderColor: state.isFocused ? "#6366f1" : "#e2e8f0",
          boxShadow: "none",
          "&:hover": {
            borderColor: "#6366f1",
          },
        }),
        menuPortal: (base) => ({
          ...base,
          zIndex: 9999,
        }),
        ...props.styles,
      }}
      menuPortalTarget={document.body}
    />
  );
}
