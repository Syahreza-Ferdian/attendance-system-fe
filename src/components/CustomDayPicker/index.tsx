import { cm } from "@lib/utils";
import { WORK_SCHEDULE_DAYS_SHORT_LABEL } from "@/types/work-schedule/work-schedule.types";
import type { DayPickerProps } from "./day-picker-interfaces.types";

export default function DayPicker({
  value,
  onChange,
  error,
  disabled,
}: DayPickerProps) {
  const toggle = (day: number) => {
    if (disabled) return;
    if (value.includes(day)) {
      onChange(value.filter((d) => d !== day));
    } else {
      onChange([...value, day].sort((a, b) => a - b));
    }
  };

  // Workdays shortcut
  const setWorkdays = () => onChange([1, 2, 3, 4, 5]);
  const setAll = () => onChange([0, 1, 2, 3, 4, 5, 6]);
  const clearAll = () => onChange([]);

  return (
    <div className="flex flex-col gap-2">
      {/* Day toggle buttons */}
      <div className="flex gap-2 flex-wrap">
        {[0, 1, 2, 3, 4, 5, 6].map((day) => {
          const active = value.includes(day);
          const isWeekend = day === 0 || day === 6;
          return (
            <button
              key={day}
              type="button"
              onClick={() => toggle(day)}
              disabled={disabled}
              className={cm(
                "w-12 h-12 rounded-xl text-sm font-semibold transition-all duration-150 flex flex-col items-center justify-center gap-0.5 border-2 select-none",
                "focus:outline-none focus:ring-2 focus:ring-primary-500/30",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                active
                  ? isWeekend
                    ? "bg-amber-500 border-amber-500 text-white shadow-sm"
                    : "bg-primary-600 border-primary-600 text-white shadow-sm"
                  : "bg-white border-slate-200 text-ink-secondary hover:border-primary-300 hover:bg-primary-50",
              )}
            >
              <span className="text-[11px] leading-none">
                {WORK_SCHEDULE_DAYS_SHORT_LABEL[day]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Quick select shortcuts */}
      {!disabled && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-ink-tertiary">Pilih cepat:</span>
          <button
            type="button"
            onClick={setWorkdays}
            className="text-xs text-primary-600 hover:underline font-medium"
          >
            Sen–Jum
          </button>
          <span className="text-slate-200">|</span>
          <button
            type="button"
            onClick={setAll}
            className="text-xs text-primary-600 hover:underline font-medium"
          >
            Semua
          </button>
          <span className="text-slate-200">|</span>
          <button
            type="button"
            onClick={clearAll}
            className="text-xs text-red-500 hover:underline font-medium"
          >
            Hapus
          </button>
        </div>
      )}

      {/* Selected summary */}
      {value.length > 0 && (
        <p className="text-xs text-ink-tertiary">
          Dipilih:{" "}
          <span className="font-medium text-ink">
            {value.map((d) => WORK_SCHEDULE_DAYS_SHORT_LABEL[d]).join(", ")}
          </span>
        </p>
      )}

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
