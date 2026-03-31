/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, type SubmitHandler } from "react-hook-form";
import { isAxiosError } from "axios";
import toast from "react-hot-toast";
import { Controller } from "react-hook-form";
import {
  User,
  Mail,
  Phone,
  Lock,
  AtSign,
  Eye,
  EyeOff,
  Save,
  ImagePlus,
  X,
  UserCircle2,
} from "lucide-react";
import useGetUserById from "@/services/user/useGetUserById";
import useGetAllPositions from "@/services/position/useGetAllPositions";
import useGetAllRoles from "@/services/role/useGetAllRoles";
import type { ICreateUserPayload } from "@/types/user/user.types";
import useCreateUser from "@/services/user/useCreateUser";
import useUpdateUser from "@/services/user/useUpdateUser";
import { CardBody, CardHeader, CardRoot } from "@/components/Card";
import Button from "@/components/Button";
import CustomSelect, { CustomLabel, Input } from "@/components/Form";
import { capitalizeFirstLetter, getImageUrl } from "@/lib/utils";
import Swal from "sweetalert2";

function FieldSkeleton() {
  return (
    <div className="space-y-1.5">
      <div className="h-4 w-28 bg-slate-100 rounded animate-pulse" />
      <div className="h-10 bg-slate-100 rounded-xl animate-pulse" />
    </div>
  );
}

interface Props {
  isEditMode?: boolean;
  userId?: string;
}

export default function EmployeeCreateForm({ isEditMode, userId }: Props) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [serverErrors, setServerErrors] = useState<string[]>([]);
  // Foto profil
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Services
  const { user, loading: userLoading } = useGetUserById(userId);
  const { positions, loading: positionsLoading } = useGetAllPositions({
    withoutQueryString: true,
  });
  const { roles, loading: rolesLoading } = useGetAllRoles();
  const { createUser } = useCreateUser();
  const { updateUser } = useUpdateUser();

  const isLoadingData = userLoading || positionsLoading || rolesLoading;

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting, isValid, isDirty },
  } = useForm<ICreateUserPayload>({ mode: "onSubmit" });

  useEffect(() => {
    if (isEditMode && user) {
      reset({
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: "",
        phoneNumber: user.phoneNumber,
        roleId: user.role.id,
        positionId: user.position.id,
      });
      if (user.profileImage) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setImagePreview(user.profileImage);
      }
    }
  }, [isEditMode, user, reset]);

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handlePickImage = () => fileInputRef.current?.click();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setImageFile(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setImageFile(null);
  };

  const positionOptions = useMemo(
    () => positions.map((pos) => ({ label: pos.name, value: pos.id })),
    [positions],
  );

  const roleOptions = useMemo(
    () => roles.map((role) => ({ label: role.name, value: Number(role.id) })),
    [roles],
  );

  const serverErrorMap = useMemo(() => {
    const map: Record<string, string> = {};
    serverErrors.forEach((msg) => {
      const key = msg.split(" ")[0];
      map[key] = msg;
    });
    return map;
  }, [serverErrors]);

  const onSubmit: SubmitHandler<ICreateUserPayload> = async (values) => {
    setServerErrors([]);

    const payload: ICreateUserPayload = { ...values };

    // const imageFile = fileInputRef.current?.files?.[0];
    if (imageFile) {
      payload.profilePictureFile = imageFile;
    }

    // console.log("imageFile state:", imageFile);
    // console.log("payload.profilePictureFile:", payload.profilePictureFile);
    // console.log("instanceof File:", payload.profilePictureFile instanceof File);

    // const formData = jsonToFormData(payload as { [key: string]: any });
    // for (const [key, value] of formData.entries()) {
    //   console.log(`FormData → ${key}:`, value);
    // }

    if (isEditMode && !payload.password?.trim()) {
      delete payload.password;
    }

    try {
      const res = !isEditMode
        ? await createUser(payload)
        : await updateUser(userId!, payload);

      //   toast.success(
      //     res.data?.message ??
      //       (isEditMode
      //         ? "Data karyawan berhasil diperbarui."
      //         : "Karyawan berhasil ditambahkan."),
      //   );

      await Swal.fire({
        icon: "success",
        title:
          res.data?.message ??
          (isEditMode
            ? "Data karyawan berhasil diperbarui."
            : "Karyawan berhasil ditambahkan."),
        showConfirmButton: true,
      });

      navigate("/hr/master-data/employees");
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
      {/* Banner ringkasan error dari server */}
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

      <div className="grid grid-cols-12 gap-5">
        {/* ── Kolom kiri ── */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-5">
          {/* Card: Identitas */}
          <CardRoot>
            <CardHeader
              title="Identitas Karyawan"
              subtitle="Nama lengkap dan kontak"
            />
            <CardBody className="grid grid-cols-12 gap-4">
              {isLoadingData ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="col-span-12 sm:col-span-6">
                    <FieldSkeleton />
                  </div>
                ))
              ) : (
                <>
                  {/* Nama Depan */}
                  <div className="col-span-12 sm:col-span-6">
                    <CustomLabel label="Nama Depan" required>
                      <Input
                        leftIcon={<User size={15} />}
                        placeholder="Contoh: Andi"
                        error={
                          errors.firstName?.message || serverErrorMap.firstName
                        }
                        {...register("firstName", {
                          required: "Nama depan wajib diisi.",
                          minLength: {
                            value: 2,
                            message: "Minimal 2 karakter.",
                          },
                        })}
                      />
                    </CustomLabel>
                  </div>

                  {/* Nama Belakang */}
                  <div className="col-span-12 sm:col-span-6">
                    <CustomLabel label="Nama Belakang" required>
                      <Input
                        leftIcon={<User size={15} />}
                        placeholder="Contoh: Pratama"
                        error={
                          errors.lastName?.message || serverErrorMap.lastName
                        }
                        {...register("lastName", {
                          required: "Nama belakang wajib diisi.",
                          minLength: {
                            value: 2,
                            message: "Minimal 2 karakter.",
                          },
                        })}
                      />
                    </CustomLabel>
                  </div>

                  {/* Username */}
                  <div className="col-span-12 sm:col-span-6">
                    <CustomLabel
                      label="Username"
                      required
                      hint="Digunakan untuk login ke sistem."
                    >
                      <Input
                        leftIcon={<AtSign size={15} />}
                        placeholder="Contoh: andi.pratama"
                        autoComplete="off"
                        error={
                          errors.username?.message || serverErrorMap.username
                        }
                        {...register("username", {
                          required: "Username wajib diisi.",
                          minLength: {
                            value: 3,
                            message: "Minimal 3 karakter.",
                          },
                          pattern: {
                            value: /^[a-zA-Z0-9._-]+$/,
                            message:
                              "Hanya huruf, angka, titik, underscore, atau tanda hubung.",
                          },
                        })}
                      />
                    </CustomLabel>
                  </div>

                  {/* Nomor HP */}
                  <div className="col-span-12 sm:col-span-6">
                    <CustomLabel
                      label="Nomor HP"
                      required
                      hint="Format Indonesia, contoh: 08123456789"
                    >
                      <Input
                        leftIcon={<Phone size={15} />}
                        type="tel"
                        placeholder="08xxxxxxxxxx"
                        error={
                          errors.phoneNumber?.message ||
                          serverErrorMap.phoneNumber
                        }
                        {...register("phoneNumber", {
                          required: "Nomor HP wajib diisi.",
                          pattern: {
                            value: /^(\+62|62|0)8[1-9][0-9]{6,11}$/,
                            message:
                              "Nomor HP Indonesia tidak valid. Contoh: 08123456789",
                          },
                        })}
                      />
                    </CustomLabel>
                  </div>
                </>
              )}
            </CardBody>
          </CardRoot>

          {/* Card: Akun & Akses */}
          <CardRoot>
            <CardHeader
              title="Akun & Akses"
              subtitle={
                isEditMode
                  ? "Kosongkan password jika tidak ingin mengubah."
                  : "Kredensial login dan hak akses karyawan."
              }
            />
            <CardBody className="grid grid-cols-12 gap-4">
              {isLoadingData ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="col-span-12 sm:col-span-6">
                    <FieldSkeleton />
                  </div>
                ))
              ) : (
                <>
                  {/* Email */}
                  <div className="col-span-12 sm:col-span-6">
                    <CustomLabel label="Email" required>
                      <Input
                        leftIcon={<Mail size={15} />}
                        type="email"
                        placeholder="nama@perusahaan.com"
                        autoComplete="email"
                        error={errors.email?.message || serverErrorMap.email}
                        {...register("email", {
                          required: "Email wajib diisi.",
                          pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: "Format email tidak valid.",
                          },
                        })}
                      />
                    </CustomLabel>
                  </div>

                  {/* Password */}
                  <div className="col-span-12 sm:col-span-6">
                    <CustomLabel
                      label={
                        isEditMode ? "Password Baru (opsional)" : "Password"
                      }
                      required={!isEditMode}
                    >
                      <Input
                        leftIcon={<Lock size={15} />}
                        type={showPassword ? "text" : "password"}
                        placeholder={
                          isEditMode
                            ? "Kosongkan jika tidak diubah"
                            : "Min. 8 karakter"
                        }
                        autoComplete="new-password"
                        error={
                          errors.password?.message || serverErrorMap.password
                        }
                        rightElement={
                          <button
                            type="button"
                            onClick={() => setShowPassword((v) => !v)}
                            className="text-ink-tertiary hover:text-ink-secondary transition-colors"
                            tabIndex={-1}
                          >
                            {showPassword ? (
                              <EyeOff size={15} />
                            ) : (
                              <Eye size={15} />
                            )}
                          </button>
                        }
                        {...register("password", {
                          required: !isEditMode
                            ? "Password wajib diisi."
                            : false,
                          minLength: !isEditMode
                            ? { value: 8, message: "Minimal 8 karakter." }
                            : undefined,
                          validate: (val) => {
                            if (
                              isEditMode &&
                              val &&
                              val.trim().length > 0 &&
                              val.length < 8
                            ) {
                              return "Minimal 8 karakter.";
                            }
                            return true;
                          },
                        })}
                      />
                    </CustomLabel>
                  </div>

                  {/* Role */}
                  <div className="col-span-12 sm:col-span-6">
                    <CustomLabel label="Role / Hak Akses" required>
                      <Controller
                        name="roleId"
                        control={control}
                        rules={{
                          required: "Role wajib dipilih.",
                          validate: (val: any) =>
                            !val || val <= 0 ? "Role wajib dipilih." : true,
                        }}
                        render={({ field }) => (
                          <CustomSelect
                            {...field}
                            options={roleOptions}
                            placeholder="Pilih role"
                            isLoading={rolesLoading}
                            onChange={(
                              selected: { label: string; value: number } | null,
                            ) => field.onChange(selected?.value)}
                            value={
                              roleOptions.find(
                                (option) =>
                                  option.value === Number(field.value),
                              ) || null
                            }
                          />
                        )}
                      ></Controller>
                    </CustomLabel>
                  </div>

                  {/* Posisi */}
                  <div className="col-span-12 sm:col-span-6">
                    <CustomLabel label="Posisi / Jabatan" required>
                      <Controller
                        name="positionId"
                        control={control}
                        rules={{
                          required: "Posisi wajib dipilih.",
                          validate: (val: any) =>
                            !val ? "Posisi wajib dipilih." : true,
                        }}
                        render={({ field }) => (
                          <CustomSelect
                            {...field}
                            options={positionOptions}
                            placeholder="Pilih posisi"
                            isLoading={positionsLoading}
                            onChange={(
                              selected: { label: string; value: string } | null,
                            ) => field.onChange(selected?.value)}
                            value={
                              positionOptions.find(
                                (option) => option.value === field.value,
                              ) || null
                            }
                          />
                        )}
                      ></Controller>
                    </CustomLabel>
                  </div>
                </>
              )}
            </CardBody>
          </CardRoot>
        </div>

        {/* ── Kolom kanan ── */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-5">
          {/* Card: Foto Profil */}
          <CardRoot>
            <CardHeader title="Foto Profil" subtitle="Opsional — maks. 2 MB" />
            <CardBody className="flex flex-col items-center gap-4">
              <div className="relative w-full aspect-square max-w-45 rounded-2xl overflow-hidden bg-slate-100 flex items-center justify-center border border-slate-200">
                {imagePreview ? (
                  <>
                    <img
                      src={
                        isEditMode && user?.profileImage === imagePreview
                          ? getImageUrl(user.profileImage)
                          : imagePreview
                      }
                      alt="Preview foto profil"
                      className="w-full h-full object-cover"
                    />
                    {isEditMode && imagePreview === user?.profileImage ? (
                      <></>
                    ) : (
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center shadow hover:bg-red-600 transition-colors"
                        title="Hapus foto"
                      >
                        <X size={12} strokeWidth={2.5} />
                      </button>
                    )}
                  </>
                ) : (
                  <UserCircle2 size={52} className="text-slate-300" />
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                className="hidden"
                onChange={handleImageChange}
              />

              <Button
                type="button"
                variant="outline"
                size="sm"
                leftIcon={<ImagePlus size={14} />}
                onClick={handlePickImage}
                className="w-full"
              >
                {imagePreview ? "Ganti Foto" : "Pilih Foto"}
              </Button>
              <p className="text-xs text-ink-tertiary text-center">
                Format: JPG, PNG, WebP
              </p>
            </CardBody>
          </CardRoot>

          {/* Card: Simpan */}
          <CardRoot>
            <CardHeader title="Simpan Data" />
            <CardBody className="flex flex-col gap-3">
              <p className="text-xs text-ink-tertiary leading-relaxed">
                {isEditMode
                  ? "Perubahan akan langsung tersimpan dan berlaku untuk karyawan ini."
                  : "Pastikan semua data sudah benar sebelum menyimpan."}
              </p>

              <Button
                type="submit"
                variant="primary"
                className="w-full"
                loading={isSubmitting}
                disabled={
                  isSubmitting ||
                  isLoadingData ||
                  (!isEditMode && !isValid) ||
                  (isEditMode && !isDirty && !imageFile)
                }
                leftIcon={<Save size={15} />}
              >
                {isSubmitting
                  ? "Menyimpan..."
                  : isEditMode
                    ? "Perbarui Data"
                    : "Simpan Karyawan"}
              </Button>

              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => navigate("/hr/master-data/employees")}
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
