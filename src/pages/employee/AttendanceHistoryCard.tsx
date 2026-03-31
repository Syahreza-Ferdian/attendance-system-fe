import { History } from "lucide-react";
import { formatTime } from "@lib/utils";
import type { Attendance } from "@/types/attendance/attendance.types";
import { CardBody, CardHeader, CardRoot, EmptyCard } from "@/components/Card";
import { AttendanceBadge } from "@/components/Badge";

interface Props {
  records: Attendance[] | null;
  loading?: boolean;
}

export default function AttendanceHistoryCard({ records, loading }: Props) {
  return (
    <CardRoot>
      <CardHeader
        title="Riwayat Absensi"
        subtitle="7 hari terakhir"
        // action={
        //   <a
        //     href="/employee/attendance/history"
        //     className="text-xs text-primary-600 hover:underline font-medium"
        //   >
        //     Lihat semua →
        //   </a>
        // }
      />
      <CardBody className="p-0">
        {loading ? (
          <div className="flex flex-col gap-0">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-5 py-3.5 border-t border-slate-100 first:border-0"
              >
                <div className="w-8 h-8 rounded-lg bg-slate-100 animate-pulse flex-shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 w-28 bg-slate-100 rounded animate-pulse" />
                  <div className="h-3 w-20 bg-slate-100 rounded animate-pulse" />
                </div>
                <div className="h-6 w-16 bg-slate-100 rounded-full animate-pulse" />
              </div>
            ))}
          </div>
        ) : records?.length === 0 ? (
          <EmptyCard
            icon={<History size={20} />}
            title="Belum ada riwayat"
            description="Riwayat absensi Anda akan muncul di sini."
          />
        ) : (
          <div>
            {records?.map((rec, i) => (
              <div
                key={rec.id}
                className={`flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors ${i > 0 ? "border-t border-slate-100" : ""}`}
              >
                {/* Day indicator */}
                <div className="w-9 h-9 rounded-xl bg-slate-100 flex flex-col items-center justify-center flex-shrink-0">
                  <span className="text-[10px] font-semibold text-ink-tertiary uppercase leading-none">
                    {new Date(rec.workDate).toLocaleDateString("id-ID", {
                      weekday: "short",
                    })}
                  </span>
                  <span className="text-sm font-bold text-ink leading-tight">
                    {new Date(rec.workDate).getDate()}
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-ink truncate">
                    {new Date(rec.workDate).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5 text-[11px] text-ink-tertiary">
                    {rec.attendanceIn && (
                      <span>
                        Masuk:{" "}
                        <span className="font-mono font-medium">
                          {formatTime(rec.attendanceIn)}
                        </span>
                      </span>
                    )}
                    {rec.attendanceIn && rec.attendanceOut && (
                      <span className="text-slate-300">·</span>
                    )}
                    {rec.attendanceOut && (
                      <span>
                        Pulang:{" "}
                        <span className="font-mono font-medium">
                          {formatTime(rec.attendanceOut)}
                        </span>
                      </span>
                    )}
                    {!rec.attendanceIn && !rec.attendanceOut && (
                      <span className="text-slate-400">
                        Tidak ada data waktu
                      </span>
                    )}
                  </div>
                </div>
                <AttendanceBadge status={rec.status} />
              </div>
            ))}
          </div>
        )}
      </CardBody>
    </CardRoot>
  );
}
