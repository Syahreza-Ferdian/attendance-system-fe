import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, type SubmitHandler } from "react-hook-form";
import { isAxiosError } from "axios";
import toast from "react-hot-toast";
import { User, Save, X } from "lucide-react";
import { CardBody, CardHeader, CardRoot } from "@/components/Card";
import Button from "@/components/Button";
import { CustomLabel, Input, Textarea } from "@/components/Form";
import { capitalizeFirstLetter } from "@/lib/utils";
import Swal from "sweetalert2";
import useGetDivisionById from "@/services/divison/useGetDivisionById";
import type { ICreateDivisionPayload } from "@/types/division/division.types";
import useCreateDivision from "@/services/divison/useCreateDivision";
import useUpdateDivision from "@/services/divison/useUpdateDivision";
import FieldSkeleton from "@/components/Skeleton";

interface Props {
  isEditMode?: boolean;
  divisionId?: string;
}

export default function DivisionCreateForm({ isEditMode, divisionId }: Props) {
  const navigate = useNavigate();
  const [serverErrors, setServerErrors] = useState<string[]>([]);
  // Foto profil

  // Services
  const { division, loading } = useGetDivisionById(divisionId);
  const { createDivision } = useCreateDivision();
  const { updateDivision } = useUpdateDivision();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid, isDirty },
  } = useForm<ICreateDivisionPayload>({ mode: "onSubmit" });

  useEffect(() => {
    if (isEditMode && division) {
      reset({
        name: division.name,
        description: division.description || "",
      });
    }
  }, [isEditMode, division, reset]);

  const serverErrorMap = useMemo(() => {
    const map: Record<string, string> = {};
    serverErrors.forEach((msg) => {
      const key = msg.split(" ")[0];
      map[key] = msg;
    });
    return map;
  }, [serverErrors]);

  const onSubmit: SubmitHandler<ICreateDivisionPayload> = async (values) => {
    setServerErrors([]);

    const payload: ICreateDivisionPayload = { ...values };

    try {
      const res = !isEditMode
        ? await createDivision(payload)
        : await updateDivision(divisionId!, payload);

      await Swal.fire({
        icon: "success",
        title:
          res.data?.message ??
          (isEditMode
            ? "Data divisi berhasil diperbarui."
            : "Divisi berhasil ditambahkan."),
        showConfirmButton: true,
      });

      navigate("/hr/master-data/divisions");
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        const responseData = error.response?.data;
        // Backend: { isSuccess, statusCode, message, error: string[] }
        if (Array.isArray(responseData?.error)) {
          setServerErrors(responseData.error);
        }
        toast.error(
          capitalizeFirstLetter(responseData?.message) ??
            "Terjadi kesalahan. Periksa kembali isian Anda.",
        );
      } else {
        toast.error((error as Error).message);
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
              Gagal menyimpan. Perbaiki kesalahan berikut:
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

      <div className="grid grid-cols-3 gap-5">
        {/* ── Kolom kiri ── */}
        <div className="col-span-3 lg:col-span-2 flex flex-col gap-5">
          {/* Card: Identitas */}
          <CardRoot>
            <CardHeader
              title="Identitas Divisi"
              subtitle="Nama divisi dan deskripsi"
            />
            <CardBody className="grid grid-cols-12 gap-4">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="col-span-12 sm:col-span-6">
                    <FieldSkeleton />
                  </div>
                ))
              ) : (
                <>
                  {/* Nama Divisi */}
                  <div className="col-span-12 sm:col-span-6">
                    <CustomLabel label="Nama Divisi" required>
                      <Input
                        leftIcon={<User size={15} />}
                        placeholder="Contoh: Divisi IT"
                        error={errors.name?.message || serverErrorMap.name}
                        {...register("name", {
                          required: "Nama divisi wajib diisi.",
                          minLength: {
                            value: 2,
                            message: "Minimal 2 karakter.",
                          },
                        })}
                      />
                    </CustomLabel>
                  </div>

                  {/* Deskripsi */}
                  <div className="col-span-12 sm:col-span-6">
                    <CustomLabel label="Deskripsi">
                      <Textarea
                        placeholder="Deskripsi singkat tentang divisi ini."
                        error={
                          errors.description?.message ||
                          serverErrorMap.description
                        }
                        {...register("description")}
                      />
                    </CustomLabel>
                  </div>
                </>
              )}
            </CardBody>
          </CardRoot>
        </div>

        <CardRoot>
          <CardHeader title="Simpan Data" />
          <CardBody className="flex flex-col gap-3">
            <p className="text-xs text-ink-tertiary leading-relaxed">
              {isEditMode
                ? "Perubahan akan langsung tersimpan dan berlaku untuk divisi ini."
                : "Pastikan semua data sudah benar sebelum menyimpan."}
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
                  ? "Perbarui Data"
                  : "Simpan Divisi"}
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => navigate("/hr/master-data/divisions")}
              disabled={isSubmitting}
            >
              Batal
            </Button>
          </CardBody>
        </CardRoot>
      </div>
    </form>
  );
}
