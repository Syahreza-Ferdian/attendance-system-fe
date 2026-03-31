import { useState, useRef, useEffect } from "react";
import { Search, X, Check, ChevronDown, Users } from "lucide-react";
import { cm, getImageUrl, getInitials } from "@lib/utils";
import type { User } from "@/types/user/user.types";

interface UserMultiSelectProps {
  users: User[];
  value: string[];
  onChange: (ids: string[]) => void;
  loading?: boolean;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
}

export default function UserMultiSelect({
  users,
  value,
  onChange,
  loading,
  error,
  placeholder = "Cari dan pilih karyawan...",
  disabled,
}: UserMultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(() => searchRef.current?.focus(), 50);
    }
  }, [open]);

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    const fullName = `${u.firstName} ${u.lastName}`.toLowerCase();
    return (
      (fullName.includes(q) ||
        u.username.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q)) &&
      !(u.userWorkSchedules && u.userWorkSchedules.length > 0)
    );
  });

  const selectedUsers = users.filter((u) => value.includes(u.id));

  const toggle = (id: string) => {
    if (value.includes(id)) {
      onChange(value.filter((v) => v !== id));
    } else {
      onChange([...value, id]);
    }
  };

  const removeOne = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(value.filter((v) => v !== id));
  };

  const clearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange([]);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div
        onClick={() => !disabled && setOpen((p) => !p)}
        className={cm(
          "min-h-10.5 w-full px-3 py-2 rounded-xl border bg-white text-sm",
          "flex flex-wrap items-center gap-1.5 cursor-pointer transition-all",
          "focus-within:ring-2 focus-within:ring-primary-500/30",
          open
            ? "border-primary-400 ring-2 ring-primary-500/30"
            : "border-slate-200",
          error && "border-red-400",
          disabled && "opacity-50 cursor-not-allowed bg-slate-50",
        )}
      >
        {selectedUsers.length === 0 && (
          <span className="text-ink-tertiary text-sm flex-1">
            {placeholder}
          </span>
        )}

        {/* Selected chips */}
        {selectedUsers.map((u) => (
          <span
            key={u.id}
            className="inline-flex items-center gap-1.5 bg-primary-50 border border-primary-200 text-primary-800 rounded-lg px-2 py-0.5 text-xs font-medium"
          >
            <span className="w-4 h-4 rounded bg-primary-600 text-white text-[9px] font-bold flex items-center justify-center shrink-0">
              {getInitials(`${u.firstName} ${u.lastName}`)}
            </span>
            {u.firstName} {u.lastName}
            {!disabled && (
              <button
                type="button"
                onClick={(e) => removeOne(u.id, e)}
                className="text-primary-400 hover:text-primary-700 transition-colors"
              >
                <X size={11} strokeWidth={2.5} />
              </button>
            )}
          </span>
        ))}

        <div className="ml-auto flex items-center gap-1.5 shrink-0">
          {selectedUsers.length > 0 && !disabled && (
            <button
              type="button"
              onClick={clearAll}
              className="text-slate-400 hover:text-red-500 transition-colors p-0.5"
              title="Hapus semua"
            >
              <X size={14} />
            </button>
          )}
          <ChevronDown
            size={16}
            className={cm(
              "text-slate-400 transition-transform duration-200",
              open && "rotate-180",
            )}
          />
        </div>
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1.5 bg-white rounded-xl border border-slate-200 shadow-card-lg overflow-hidden animate-slide-in-up">
          {/* Search box */}
          <div className="p-2 border-b border-slate-100">
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-tertiary pointer-events-none"
              />
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari karyawan..."
                className="w-full pl-8 pr-3 py-1.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400"
              />
            </div>
          </div>

          {/* List */}
          <div className="max-h-56 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-8 text-xs text-ink-tertiary gap-2">
                <div className="w-4 h-4 border-2 border-primary-400 border-t-transparent rounded-full animate-spin" />
                Memuat karyawan...
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 gap-2 text-ink-tertiary">
                <Users size={20} className="text-slate-300" />
                <span className="text-xs">Tidak ada karyawan ditemukan</span>
              </div>
            ) : (
              <>
                {/* Select all / deselect all shortcut */}
                {filtered.length > 1 && (
                  <div className="px-3 py-1.5 border-b border-slate-100 flex gap-3">
                    <button
                      type="button"
                      className="text-xs text-primary-600 hover:underline font-medium"
                      onClick={() => {
                        const allIds = filtered.map((u) => u.id);
                        const newVal = [...new Set([...value, ...allIds])];
                        onChange(newVal);
                      }}
                    >
                      Pilih semua ({filtered.length})
                    </button>
                    {filtered.some((u) => value.includes(u.id)) && (
                      <>
                        <span className="text-slate-200">|</span>
                        <button
                          type="button"
                          className="text-xs text-red-500 hover:underline font-medium"
                          onClick={() => {
                            const filteredIds = filtered.map((u) => u.id);
                            onChange(
                              value.filter((v) => !filteredIds.includes(v)),
                            );
                          }}
                        >
                          Batalkan semua
                        </button>
                      </>
                    )}
                  </div>
                )}

                {filtered.map((u) => {
                  const selected = value.includes(u.id);
                  return (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => toggle(u.id)}
                      className={cm(
                        "w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-slate-50",
                        selected && "bg-primary-50/60",
                      )}
                    >
                      {/* Avatar */}
                      {u.profileImage ? (
                        <img
                          src={getImageUrl(u.profileImage)}
                          alt={u.firstName}
                          className="w-8 h-8 rounded-lg object-cover shrink-0"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-primary-100 text-primary-700 text-xs font-bold flex items-center justify-center shrink-0">
                          {getInitials(`${u.firstName} ${u.lastName}`)}
                        </div>
                      )}

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-ink truncate">
                          {u.firstName} {u.lastName}
                        </p>
                        <p className="text-xs text-ink-tertiary truncate">
                          @{u.username} · {u.position?.name ?? "—"}
                        </p>
                      </div>

                      {/* Checkmark */}
                      <div
                        className={cm(
                          "w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all",
                          selected
                            ? "bg-primary-600 border-primary-600"
                            : "border-slate-300",
                        )}
                      >
                        {selected && (
                          <Check
                            size={11}
                            className="text-white"
                            strokeWidth={3}
                          />
                        )}
                      </div>
                    </button>
                  );
                })}
              </>
            )}
          </div>

          {/* Footer count */}
          {value.length > 0 && (
            <div className="px-3 py-2 border-t border-slate-100 bg-slate-50">
              <p className="text-xs text-ink-tertiary">
                <span className="font-semibold text-primary-600">
                  {value.length}
                </span>{" "}
                karyawan dipilih
              </p>
            </div>
          )}
        </div>
      )}

      {error && <p className="text-xs text-red-500 mt-1.5">{error}</p>}
    </div>
  );
}
