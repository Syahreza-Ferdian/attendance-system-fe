import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";
import toast from "react-hot-toast";
import { Users, CalendarDays, ArrowRight, X, CheckCircle2 } from "lucide-react";
import UserMultiSelect from "./UserMultiSelect";
import { cm } from "@lib/utils";
import useGetAllWorkSchedules from "@/services/work-schedule/useGetAllWorkSchedules";
import useGetAllUsers from "@/services/user/useGetAllUsers";
import useAssignWorkSchedule from "@/services/work-schedule/useAssignWorkScheduleToUser";
import {
  WORK_SCHEDULE_DAYS_LABEL,
  type WorkSchedule,
} from "@/types/work-schedule/work-schedule.types";
import { CardBody, CardHeader, CardRoot } from "@/components/Card";
import Button from "@/components/Button";
import WorkScheduleDayBadge from "@/components/Badge";
import Swal from "sweetalert2";

function fmtTime(t: string) {
  return t?.slice(0, 5) ?? "—";
}

export default function AssignWorkScheduleForm() {
  const navigate = useNavigate();
  const [selectedScheduleId, setSelectedScheduleId] = useState<string>("");
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [serverErrors, setServerErrors] = useState<string[]>([]);

  const { workSchedules, loading: wsLoading } = useGetAllWorkSchedules();
  const { users: employees, loading: empLoading } = useGetAllUsers({
    withoutQueryString: true,
  });
  const { assignWorkSchedule } = useAssignWorkSchedule();

  const selectedSchedule: WorkSchedule | undefined = workSchedules.find(
    (ws) => ws.id === selectedScheduleId,
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedScheduleId) {
      toast.error("Pilih jadwal kerja terlebih dahulu.");
      return;
    }
    if (selectedUserIds.length === 0) {
      toast.error("Pilih minimal satu karyawan.");
      return;
    }
    setServerErrors([]);
    setSubmitting(true);
    try {
      await assignWorkSchedule({
        workScheduleId: selectedScheduleId,
        userIds: selectedUserIds,
      });

      await Swal.fire({
        title: "Berhasil!",
        text: `Jadwal berhasil di-assign ke ${selectedUserIds.length} karyawan.`,
        icon: "success",
        confirmButtonText: "OK",
      });

      navigate("/hr/master-data/work-schedules");
    } catch (err) {
      if (isAxiosError(err)) {
        const rd = err.response?.data;
        if (Array.isArray(rd?.error)) setServerErrors(rd.error);
        toast.error(rd?.message ?? "Gagal assign jadwal.");
      } else {
        toast.error((err as Error).message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const canSubmit =
    !!selectedScheduleId && selectedUserIds.length > 0 && !submitting;

  return (
    <form onSubmit={handleSubmit} noValidate>
      {serverErrors.length > 0 && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5 flex gap-3">
          <div className="shrink-0 w-4 h-4 mt-0.5 rounded-full bg-red-500 flex items-center justify-center">
            <X size={10} className="text-white" strokeWidth={3} />
          </div>
          <div>
            <p className="text-sm font-semibold text-red-600 mb-1">
              Gagal melakukan assign:
            </p>
            <ul className="space-y-0.5">
              {serverErrors.map((msg, i) => (
                <li key={i} className="text-xs text-red-500">
                  • {msg}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-5">
          <CardRoot>
            <CardHeader
              title="1. Pilih Jadwal Kerja"
              subtitle="Pilih jadwal yang akan di-assign ke karyawan"
            />
            <CardBody className="flex flex-col gap-3">
              {wsLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-24 rounded-xl bg-slate-100 animate-pulse"
                    />
                  ))}
                </div>
              ) : workSchedules.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 gap-2 text-ink-tertiary">
                  <CalendarDays size={24} className="text-slate-300" />
                  <p className="text-sm">Belum ada jadwal kerja.</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      navigate("/hr/master-data/work-schedules/create")
                    }
                  >
                    Buat Jadwal Baru
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {workSchedules.map((ws) => {
                    const active = selectedScheduleId === ws.id;
                    return (
                      <button
                        key={ws.id}
                        type="button"
                        onClick={() => setSelectedScheduleId(ws.id)}
                        className={cm(
                          "text-left p-4 rounded-xl border-2 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary-500/30",
                          active
                            ? "border-primary-500 bg-primary-50"
                            : "border-slate-200 bg-white hover:border-primary-300 hover:bg-primary-50/40",
                        )}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <p
                            className={cm(
                              "text-sm font-semibold",
                              active ? "text-primary-800" : "text-ink",
                            )}
                          >
                            {ws.name}
                          </p>
                          {active && (
                            <CheckCircle2
                              size={16}
                              className="text-primary-600 shrink-0"
                            />
                          )}
                        </div>
                        <p
                          className={cm(
                            "text-xs mb-2",
                            active ? "text-primary-600" : "text-ink-tertiary",
                          )}
                        >
                          {fmtTime(ws.startTime)} – {fmtTime(ws.endTime)}
                          <span className="ml-2">
                            · Toleransi {ws.lateToleranceMinutes} mnt
                          </span>
                        </p>
                        {ws.workScheduleDays &&
                          ws.workScheduleDays.length > 0 && (
                            <WorkScheduleDayBadge days={ws.workScheduleDays} />
                          )}
                      </button>
                    );
                  })}
                </div>
              )}
            </CardBody>
          </CardRoot>

          <CardRoot>
            <CardHeader
              title="2. Pilih Karyawan"
              subtitle="Pilih satu atau beberapa karyawan yang akan mendapatkan jadwal ini. Hanya karywan yang belum memiliki jadwal kerja yang akan ditampil;kan"
            />
            <CardBody>
              <UserMultiSelect
                users={employees}
                value={selectedUserIds}
                onChange={setSelectedUserIds}
                loading={empLoading}
                error={undefined}
                placeholder="Cari dan pilih karyawan..."
              />
            </CardBody>
          </CardRoot>
        </div>

        <div className="col-span-12 lg:col-span-4 flex flex-col gap-5">
          <CardRoot>
            <CardHeader title="Ringkasan Assign" />
            <CardBody className="flex flex-col gap-4">
              <div>
                <p className="text-xs text-ink-tertiary mb-1.5 font-medium">
                  Jadwal
                </p>
                {selectedSchedule ? (
                  <div className="rounded-xl bg-primary-50 border border-primary-200 p-3">
                    <p className="text-sm font-semibold text-primary-800">
                      {selectedSchedule.name}
                    </p>
                    <p className="text-xs text-primary-600 mt-0.5">
                      {fmtTime(selectedSchedule.startTime)} –{" "}
                      {fmtTime(selectedSchedule.endTime)}
                    </p>
                    {selectedSchedule.workScheduleDays && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {selectedSchedule.workScheduleDays
                          .sort((a, b) => a.dayOfWeek - b.dayOfWeek)
                          .map((d) => (
                            <span
                              key={d.id}
                              className="text-[10px] font-semibold bg-primary-100 text-primary-700 px-1.5 py-0.5 rounded-md"
                            >
                              {WORK_SCHEDULE_DAYS_LABEL[d.dayOfWeek]}
                            </span>
                          ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="rounded-xl bg-slate-100 border border-slate-200 p-3 flex items-center gap-2 text-ink-tertiary">
                    <CalendarDays size={14} />
                    <span className="text-xs italic">Belum dipilih</span>
                  </div>
                )}
              </div>

              <div>
                <p className="text-xs text-ink-tertiary mb-1.5 font-medium">
                  Karyawan
                </p>
                <div
                  className={cm(
                    "rounded-xl border p-3 flex items-center gap-2.5",
                    selectedUserIds.length > 0
                      ? "bg-emerald-50 border-emerald-200"
                      : "bg-slate-100 border-slate-200",
                  )}
                >
                  <Users
                    size={16}
                    className={
                      selectedUserIds.length > 0
                        ? "text-emerald-600"
                        : "text-slate-400"
                    }
                  />
                  <span
                    className={cm(
                      "text-sm font-semibold",
                      selectedUserIds.length > 0
                        ? "text-emerald-800"
                        : "text-ink-tertiary",
                    )}
                  >
                    {selectedUserIds.length > 0
                      ? `${selectedUserIds.length} karyawan dipilih`
                      : "Belum ada karyawan"}
                  </span>
                </div>
              </div>

              <hr className="border-slate-100" />

              <Button
                type="submit"
                variant="primary"
                className="w-full"
                loading={submitting}
                disabled={!canSubmit}
                leftIcon={<ArrowRight size={15} />}
              >
                {submitting ? "Memproses..." : "Assign Jadwal"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => navigate("/hr/master-data/work-schedules")}
                disabled={submitting}
              >
                Batal
              </Button>
            </CardBody>
          </CardRoot>
        </div>
      </div>
    </form>
  );
}
