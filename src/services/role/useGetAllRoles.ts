import useSWR, { type Fetcher } from "swr";
import { axiosInstance } from "@lib/axios";
import type { UserRole } from "@/types/user/user-role.types";
// import type { ApiResponse } from "@/types/api-response.types";

export default function useGetAllRoles() {
  const fetcher: Fetcher<
    UserRole[],
    { url: string; payload: object }
  > = async ({ url, payload }) => {
    const { data } = await axiosInstance({ withToken: true }).get(url, {
      params: payload,
    });

    return data.data;
  };

  const { data, error, isLoading, mutate } = useSWR(
    {
      url: "/roles",
    },
    fetcher,
  );

  return {
    loading: isLoading,
    roles: data ?? [],
    error,
    mutate,
  };
}
