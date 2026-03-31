import { useState } from "react";
import { Eye, EyeOff, Lock, Loader2, User } from "lucide-react";
import { cm } from "@/lib/utils";
import useLogin from "@/services/auth/useLogin";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { form, setForm, errors, loading, login } = useLogin();

  return (
    <div>
      {/* Mobile logo */}
      <div className="flex items-center gap-3 mb-8 lg:hidden">
        <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center">
          <span className="text-white text-lg">✓</span>
        </div>
        <span className="text-white font-bold text-lg">Absensi</span>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">
          Masuk ke akun Anda
        </h1>
        <p className="text-slate-400 text-sm">
          Gunakan kredensial yang diberikan oleh admin.
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          login();
        }}
        noValidate
        className="flex flex-col gap-4"
      >
        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-slate-300 mb-1.5"
          >
            Email atau Username
          </label>
          <div className="relative">
            <User
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
            />
            <input
              id="email"
              type="text"
              autoComplete="username"
              placeholder="Email atau username"
              value={form.identifier}
              onChange={(e) =>
                setForm((p) => ({ ...p, identifier: e.target.value }))
              }
              className={cm(
                "w-full pl-10 pr-4 py-2.5 rounded-xl text-sm",
                "bg-white/5 border text-white placeholder:text-slate-600",
                "focus:outline-none focus:ring-2 transition-all",
                errors.identifier
                  ? "border-red-500/60 focus:ring-red-500/30"
                  : "border-white/10 focus:ring-primary-500/40 focus:border-primary-500/60",
              )}
            />
          </div>
          {errors.identifier && (
            <p className="text-xs text-red-400 mt-1.5">{errors.identifier}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-slate-300 mb-1.5"
          >
            Password
          </label>
          <div className="relative">
            <Lock
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
            />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) =>
                setForm((p) => ({ ...p, password: e.target.value }))
              }
              className={cm(
                "w-full pl-10 pr-11 py-2.5 rounded-xl text-sm",
                "bg-white/5 border text-white placeholder:text-slate-600",
                "focus:outline-none focus:ring-2 transition-all",
                errors.password
                  ? "border-red-500/60 focus:ring-red-500/30"
                  : "border-white/10 focus:ring-primary-500/40 focus:border-primary-500/60",
              )}
            />
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-red-400 mt-1.5">{errors.password}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className={cm(
            "w-full mt-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-white",
            "bg-primary-600 hover:bg-primary-700 transition-all duration-150",
            "flex items-center justify-center gap-2",
            "disabled:opacity-60 disabled:cursor-not-allowed",
            "focus:outline-none focus:ring-2 focus:ring-primary-500/50",
          )}
        >
          {loading && <Loader2 size={15} className="animate-spin" />}
          {loading ? "Memproses..." : "Masuk"}
        </button>
      </form>

      <p className="text-center text-xs text-slate-600 mt-6">
        Lupa password? Hubungi administrator sistem.
      </p>
    </div>
  );
}
