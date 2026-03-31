import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, type SubmitHandler, Controller } from "react-hook-form";
import { isAxiosError } from "axios";
import toast from "react-hot-toast";
import { Clock, Tag, Timer, Save, X } from "lucide-react";
import { cm } from "@lib/utils";
import useGetWorkScheduleById from "@services/work-schedule/useGetWorkScheduleById";
import type { ICreateWorkSchedulePayload } from "@/types/work-schedule/work-schedule.types";
import FieldSkeleton from "@/components/Skeleton";
import { CustomLabel, Input, Textarea } from "@/components/Form";
import useCreateWorkSchedule from "@/services/work-schedule/useCreateWorkSchedule";
import useUpdateWorkSchedule from "@/services/work-schedule/useUpdateWorkSchedule";
import { CardBody, CardHeader, CardRoot } from "@/components/Card";
import DayPicker from "@/components/CustomDayPicker";
import Button from "@/components/Button";
import Swal from "sweetalert2";

interface Props {
  isEditMode?: boolean;
  workScheduleId?: string;
}

export default function WorkScheduleForm({
  isEditMode,
  workScheduleId,
}: Props) {
  const navigate = useNavigate();
  const [serverErrors, setServerErrors] = useState<string[]>([]);

  const { workSchedule, loading } = useGetWorkScheduleById(workScheduleId);
  const { createWorkSchedule } = useCreateWorkSchedule();
  const { updateWorkSchedule } = useUpdateWorkSchedule();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting, isValid, isDirty },
  } = useForm<ICreateWorkSchedulePayload>({
    mode: "onChange",
    defaultValues: { workScheduleDays: [] },
  });

  // Pre-fill saat edit
  useEffect(() => {
    if (isEditMode && workSchedule) {
      reset({
        name: workSchedule.name ?? "",
        description: workSchedule.description ?? "",
        startTime: workSchedule.startTime?.slice(0, 5) ?? "",
        endTime: workSchedule.endTime?.slice(0, 5) ?? "",
        lateToleranceMinutes: workSchedule.lateToleranceMinutes,
        workScheduleDays:
          workSchedule.workScheduleDays?.map((d) => d.dayOfWeek) ?? [],
      });
    }
  }, [isEditMode, workSchedule, reset]);

  const onSubmit: SubmitHandler<ICreateWorkSchedulePayload> = async (
    values,
  ) => {
    setServerErrors([]);
    try {
      const res = !isEditMode
        ? await createWorkSchedule(values)
        : await updateWorkSchedule(workScheduleId!, values);

      await Swal.fire({
        icon: "success",
        title:
          res.data?.message ??
          (isEditMode
            ? "Data jadwal kerja berhasil diperbarui."
            : "Jadwal kerja berhasil ditambahkan."),
        showConfirmButton: true,
      });

      navigate("/hr/master-data/work-schedules");
    } catch (err) {
      if (isAxiosError(err)) {
        const rd = err.response?.data;
        if (Array.isArray(rd?.error)) setServerErrors(rd.error);
        toast.error(rd?.message ?? "Terjadi kesalahan.");
      } else {
        toast.error((err as Error).message);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      {serverErrors.length > 0 && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5 flex gap-3">
          <div className="shrink-0 w-4 h-4 mt-0.5 rounded-full bg-red-500 flex items-center justify-center">
            <X size={10} className="text-white" strokeWidth={3} />
          </div>
          <div>
            <p className="text-sm font-semibold text-red-600 mb-1">
              Gagal menyimpan:
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
        {/* ── Kolom kiri (8) ── */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-5">
          {/* Card: Info dasar */}
          <CardRoot>
            <CardHeader
              title="Informasi Jadwal"
              subtitle="Nama dan deskripsi jadwal kerja"
            />
            <CardBody className="grid grid-cols-12 gap-4">
              {loading ? (
                Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="col-span-12">
                    <FieldSkeleton />
                  </div>
                ))
              ) : (
                <>
                  <div className="col-span-12">
                    <CustomLabel
                      label="Nama Jadwal"
                      required
                      error={errors.name?.message}
                    >
                      <Input
                        leftIcon={<Tag size={15} />}
                        placeholder="Contoh: Jadwal Shift Pagi"
                        error={errors.name?.message}
                        {...register("name", {
                          required: "Nama jadwal wajib diisi.",
                          minLength: {
                            value: 2,
                            message: "Minimal 2 karakter.",
                          },
                        })}
                      />
                    </CustomLabel>
                  </div>
                  <div className="col-span-12">
                    <CustomLabel
                      label="Deskripsi"
                      required
                      error={errors.description?.message}
                    >
                      <div className="relative">
                        <Textarea
                          rows={2}
                          placeholder="Deskripsi singkat jadwal kerja ini..."
                          className={cm(
                            "form-input pl-4 resize-none",
                            errors.description && "form-input-error",
                          )}
                          {...register("description", {
                            required: "Deskripsi wajib diisi.",
                          })}
                        />
                      </div>
                    </CustomLabel>
                  </div>
                </>
              )}
            </CardBody>
          </CardRoot>

          {/* Card: Jam kerja */}
          <CardRoot>
            <CardHeader
              title="Jam Kerja"
              subtitle="Waktu mulai, selesai, dan toleransi keterlambatan"
            />
            <CardBody className="grid grid-cols-12 gap-4">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="col-span-12 sm:col-span-4">
                    <FieldSkeleton />
                  </div>
                ))
              ) : (
                <>
                  <div className="col-span-12 sm:col-span-4">
                    <CustomLabel
                      label="Jam Mulai"
                      required
                      error={errors.startTime?.message}
                    >
                      <Input
                        leftIcon={<Clock size={15} />}
                        type="time"
                        error={errors.startTime?.message}
                        {...register("startTime", {
                          required: "Jam mulai wajib diisi.",
                        })}
                      />
                    </CustomLabel>
                  </div>
                  <div className="col-span-12 sm:col-span-4">
                    <CustomLabel
                      label="Jam Selesai"
                      required
                      error={errors.endTime?.message}
                    >
                      <Input
                        leftIcon={<Clock size={15} />}
                        type="time"
                        error={errors.endTime?.message}
                        {...register("endTime", {
                          required: "Jam selesai wajib diisi.",
                        })}
                      />
                    </CustomLabel>
                  </div>
                  <div className="col-span-12 sm:col-span-4">
                    <CustomLabel
                      label="Toleransi (menit)"
                      required
                      hint="Batas keterlambatan yang masih diizinkan"
                      error={errors.lateToleranceMinutes?.message}
                    >
                      <Input
                        leftIcon={<Timer size={15} />}
                        type="number"
                        min={1}
                        placeholder="15"
                        error={errors.lateToleranceMinutes?.message}
                        {...register("lateToleranceMinutes", {
                          required: "Wajib diisi.",
                          valueAsNumber: true,
                          min: { value: 1, message: "Min. 1 menit." },
                        })}
                      />
                    </CustomLabel>
                  </div>
                </>
              )}
            </CardBody>
          </CardRoot>

          {/* Card: Hari kerja */}
          <CardRoot>
            <CardHeader
              title="Hari Kerja"
              subtitle="Pilih hari di mana jadwal ini berlaku"
            />
            <CardBody>
              {loading ? (
                <div className="flex gap-2">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-12 h-12 rounded-xl bg-slate-100 animate-pulse"
                    />
                  ))}
                </div>
              ) : (
                <Controller
                  name="workScheduleDays"
                  control={control}
                  rules={{
                    validate: (v) =>
                      v.length > 0 || "Pilih minimal satu hari kerja.",
                  }}
                  render={({ field }) => (
                    <DayPicker
                      value={field.value ?? []}
                      onChange={field.onChange}
                      error={errors.workScheduleDays?.message as string}
                    />
                  )}
                />
              )}
            </CardBody>
          </CardRoot>
        </div>

        {/* ── Kolom kanan (4) ── */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-5">
          <CardRoot>
            <CardHeader title="Simpan Data" />
            <CardBody className="flex flex-col gap-3">
              <p className="text-xs text-ink-tertiary leading-relaxed">
                {isEditMode
                  ? "Perubahan akan berlaku untuk semua karyawan yang menggunakan jadwal ini."
                  : "Setelah disimpan, jadwal dapat di-assign ke karyawan."}
              </p>
              <Button
                type="submit"
                variant="primary"
                className="w-full"
                loading={isSubmitting}
                disabled={
                  isSubmitting ||
                  loading ||
                  (!isEditMode && !isValid) ||
                  (isEditMode && !isDirty)
                }
                leftIcon={<Save size={15} />}
              >
                {isSubmitting
                  ? "Menyimpan..."
                  : isEditMode
                    ? "Perbarui Jadwal"
                    : "Simpan Jadwal"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => navigate("/hr/master-data/work-schedules")}
                disabled={isSubmitting}
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
