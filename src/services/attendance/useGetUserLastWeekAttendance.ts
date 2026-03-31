import useSWR, { type Fetcher } from "swr";
import { axiosInstance } from "@lib/axios";
import type { Attendance } from "@/types/attendance/attendance.types";
import type { ApiResponse } from "@/types/api-response.types";

export default function useGetUserLastWeekAttendance() {
  const fetcher: Fetcher<ApiResponse<Attendance[]>, string> = async (url) => {
    const { data } = await axiosInstance({ withToken: true }).get(url);
    return data;
  };

  const { data, error, isLoading, mutate } = useSWR(
    "/attendance/user/last-week",
    fetcher,
  );

  const lastWeek: Attendance[] | null = data?.data ?? null;

  return {
    lastWeek,
    loading: isLoading,
    error,
    mutate,
  };
}
