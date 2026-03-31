import axiosInstance from "@/lib/axios";
import useAuthStore from "@/store/useAuthStore";
import type { ApiResponse } from "@/types/api-response.types";
import type { AuthResponse } from "@/types/auth/auth-response.types";
import { UserRoleType } from "@/types/user/user-role.types";
import { useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";

interface LoginForm {
  identifier: string;
  password: string;
}

export default function useLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useAuthStore();

  const [form, setForm] = useState<LoginForm>({
    identifier: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<LoginForm>>({});

  const from =
    (location.state as { from?: { pathname: string } })?.from?.pathname || null;

  const validate = () => {
    const errs: Partial<LoginForm> = {};

    if (!form.identifier) {
      errs.identifier = "Email atau username wajib diisi.";
    }

    if (!form.password) {
      errs.password = "Password wajib diisi.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const login = async () => {
    if (!validate()) return;

    setLoading(true);

    try {
      const { data: response } = await axiosInstance().post<
        ApiResponse<AuthResponse>
      >("/auth/login", form);

      console.log("Login response:", response);

      if (!response.isSuccess || !response.data) {
        throw new Error();
      }

      setAuth(response.data.accessToken, response.data.user);

      toast.success(`Selamat datang, ${response.data.user.firstName}!`);

      const role = response.data.user.role.name;

      const destination =
        from ??
        (role === UserRoleType.HR ? "/hr/dashboard" : "/employee/dashboard");

      navigate(destination, { replace: true });
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleError = (err: any) => {
    const status = err?.response?.status;

    switch (status) {
      case 404:
        toast.error("Username atau email tidak terdaftar.");
        break;

      case 500:
        toast.error("Terjadi kesalahan pada server.");
        break;

      default:
        toast.error(
          err?.response?.data?.error || "Terjadi kesalahan tak terduga.",
        );
    }
  };

  return {
    form,
    setForm,
    loading,
    errors,
    login,
  };
}
