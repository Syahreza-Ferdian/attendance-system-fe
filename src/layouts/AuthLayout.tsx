import { Outlet } from "react-router-dom";
import { ClipboardCheck } from "lucide-react";

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-slate-900 flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex flex-col justify-between w-105 shrink-0 bg-primary-950 p-10 relative overflow-hidden">
        {/* Decorative background circles */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-primary-800/30 rounded-full blur-3xl" />
        <div className="absolute bottom-10 -right-20 w-64 h-64 bg-primary-600/20 rounded-full blur-3xl" />

        {/* Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center shadow-lg">
            <ClipboardCheck
              className="text-white"
              size={20}
              strokeWidth={2.5}
            />
          </div>
          <div>
            <p className="text-white font-bold text-lg leading-tight">
              Absensi PT. Maju Mundur
            </p>
            <p className="text-primary-300 text-xs">Sistem Absensi WFH</p>
          </div>
        </div>

        {/* Tagline */}
        <div className="relative z-10">
          <h2 className="text-white text-3xl font-bold leading-snug mb-4">
            Kelola kehadiran
            <br />
            tim Anda dengan
            <br />
            mudah & efisien.
          </h2>
          <p className="text-primary-300 text-sm leading-relaxed">
            Pantau absensi WFH dan lihat laporan kehadiran secara real-time dari
            mana saja.
          </p>
        </div>

        {/* Bottom caption */}
        <p className="text-primary-500 text-xs relative z-10">
          © {new Date().getFullYear()} Syahreza Ferdian. All rights reserved.
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md animate-fade-in">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
