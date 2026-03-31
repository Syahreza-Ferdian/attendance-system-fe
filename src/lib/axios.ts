import axios from "axios";
import useAuthStore from "@store/useAuthStore";
import config from "@/constants/config";

const BASE_URL = config.BASE_API_URL;

interface AxiosInstanceOptions {
  withToken?: boolean;
}

export function axiosInstance(options?: AxiosInstanceOptions) {
  const instance = axios.create({
    baseURL: BASE_URL,
    headers: {
      Accept: "application/json",
    },
  });

  // Request interceptor — inject auth token
  instance.interceptors.request.use(
    (config) => {
      if (options?.withToken) {
        const token = useAuthStore.getState().token;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }

      if (!(config.data instanceof FormData)) {
        config.headers["Content-Type"] = "application/json";
      }

      return config;
    },
    (error) => Promise.reject(error),
  );

  // Response interceptor — handle 401
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        useAuthStore.getState().clearAuth();
        window.location.href = "/login";
      }
      return Promise.reject(error);
    },
  );

  return instance;
}

export default axiosInstance;
