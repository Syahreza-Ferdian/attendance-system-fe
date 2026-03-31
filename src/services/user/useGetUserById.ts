import axiosInstance from "@/lib/axios";
import type { User } from "@/types/user/user.types";
import type { Fetcher } from "swr";
import useSWR from "swr";

export default function useGetUserById(userId?: string) {
  const fetcher: Fetcher<User, string> = async (url) => {
    const { data } = await axiosInstance({ withToken: true }).get(url);

    return data.data;
  };

  const { data, error, isLoading } = useSWR(
    userId ? `/users/${userId}` : null,
    fetcher,
  );

  return {
    user: data ?? null,
    loading: isLoading,
    error,
  };
}
