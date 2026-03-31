import { Menu, ChevronDown, LogOut, User } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "@store/useAuthStore";
import useUIStore from "@store/useUIStore";
import { getImageUrl, getInitials } from "@lib/utils";
import { formatDate } from "@lib/utils";

export default function DefaultNavbar() {
  const { toggleSidebar } = useUIStore();
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const today = formatDate(new Date().toISOString(), {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-navbar">
      <div className="flex items-center justify-between px-6 h-14">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu size={20} />
          </button>
          <p className="text-xs text-ink-tertiary hidden sm:block">{today}</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((p) => !p)}
              className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <div className="w-7 h-7 rounded-lg bg-primary-600 flex items-center justify-center text-white text-xs font-bold shrink-0 overflow-hidden">
                {user?.profileImage ? (
                  <img
                    src={getImageUrl(user.profileImage)}
                    alt="profile-picture"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>
                    {getInitials(user?.firstName + " " + user?.lastName)}
                  </span>
                )}
              </div>
              <div className="hidden sm:flex flex-col items-start">
                <span className="text-[13px] font-semibold text-ink leading-tight">
                  {user?.firstName ?? "User"}
                </span>
                <span className="text-[11px] text-ink-tertiary capitalize leading-tight">
                  {user?.role.name ?? "—"}
                </span>
              </div>
              <ChevronDown
                size={14}
                className="text-slate-400 hidden sm:block"
              />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-card-lg border border-slate-100 py-1.5 animate-slide-in-up z-50">
                <div className="px-4 py-2.5 border-b border-slate-100">
                  <p className="text-sm font-semibold text-ink">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-ink-tertiary">{user?.email}</p>
                </div>
                <div className="py-1">
                  <Link
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-ink-secondary hover:bg-slate-50 hover:text-ink transition-colors"
                  >
                    <User size={15} />
                    Profil Saya
                  </Link>
                  {/* <Link
                    to="/settings"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-ink-secondary hover:bg-slate-50 hover:text-ink transition-colors"
                  >
                    <Settings size={15} />
                    Pengaturan
                  </Link> */}
                </div>
                <div className="border-t border-slate-100 pt-1">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={15} />
                    Keluar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
