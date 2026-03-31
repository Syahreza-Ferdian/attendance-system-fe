import useAuthStore from "@store/useAuthStore";
import { getInitials } from "@lib/utils";
import { cm } from "@lib/utils";
import useLiveClock from "@/services/employee/useLiveClock";
import React from "react";

function ClockWidget() {
  const { hours, minutes, seconds, dateLong, greeting } = useLiveClock();
  const user = useAuthStore((s) => s.user);

  //   console.log(user?.userWorkSchedules?.length);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-slate-900 via-primary-950 to-slate-900 p-6 text-white shadow-card-lg">
      <div className="pointer-events-none absolute -top-10 -right-10 w-48 h-48 rounded-full bg-primary-600/15 blur-2xl" />
      <div className="pointer-events-none absolute bottom-0 -left-6 w-32 h-32 rounded-full bg-indigo-500/10 blur-2xl" />

      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex gap-6">
          <div
            className="flex items-center gap-4 pe-6"
            style={{ borderRight: "1px solid #90a1b9" }}
          >
            <div className="w-12 h-12 rounded-xl bg-primary-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-lg">
              {user ? getInitials(user.firstName + " " + user.lastName) : "U"}
            </div>
            <div>
              <p className="text-primary-300 text-xs font-medium mb-0.5">
                {greeting} 👋
              </p>
              <p className="text-white font-bold text-lg leading-tight">
                {user ? `${user.firstName} ${user.lastName}` : "Karyawan"}
              </p>
              <p className="text-slate-400 text-xs mt-0.5">{dateLong}</p>
            </div>
          </div>

          <div>
            {/* informasi shift kerja */}
            <p className="text-xs text-slate-400 font-medium">Shift Kerja</p>
            <div>
              <p className="text-white font-bold text-lg">
                {user?.userWorkSchedules?.[0] === null
                  ? "Tidak ada jadwal"
                  : (user?.userWorkSchedules?.[0]?.workSchedule?.name ??
                    "Informasi shift tidak tersedia")}
              </p>

              <p className="text-slate-400 text-xs mt-0.5">
                {user?.userWorkSchedules?.[0]?.workSchedule?.startTime &&
                user?.userWorkSchedules?.[0]?.workSchedule?.endTime
                  ? ` (${user.userWorkSchedules[0].workSchedule.startTime} - ${user.userWorkSchedules[0].workSchedule.endTime})`
                  : ""}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start sm:items-end gap-1.5">
          <div className="flex items-end gap-1">
            <span className="font-mono text-5xl font-bold text-white tracking-tight leading-none tabular-nums">
              {hours}
            </span>
            <span className="font-mono text-3xl font-bold text-primary-400 leading-none tabular-nums mb-0.5 animate-pulse">
              :
            </span>
            <span className="font-mono text-5xl font-bold text-white tracking-tight leading-none tabular-nums">
              {minutes}
            </span>
            <span className="font-mono text-xl font-semibold text-slate-500 leading-none tabular-nums mb-1 ml-1">
              :{seconds}
            </span>
          </div>

          <div
            className={cm(
              "flex items-center gap-1.5 text-xs font-medium text-emerald-400",
            )}
          >
            {user?.position.name + " - " + user?.position.division?.name}
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(ClockWidget);
