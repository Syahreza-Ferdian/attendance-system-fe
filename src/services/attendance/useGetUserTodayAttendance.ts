import useSWR, { type Fetcher } from "swr";
import { axiosInstance } from "@lib/axios";
import type { TodayAttendance } from "@/types/attendance/attendance.types";
import type { ApiResponse } from "@/types/api-response.types";

export default function useGetTodayAttendance() {
  const fetcher: Fetcher<ApiResponse<TodayAttendance>, string> = async (
    url,
  ) => {
    const { data } = await axiosInstance({ withToken: true }).get(url);
    return data;
  };

  const { data, error, isLoading, mutate } = useSWR(
    "/attendance/user/today",
    fetcher,
  );

  const today: TodayAttendance = data?.data ?? null;

  return {
    today,
    loading: isLoading,
    error,
    mutate,
  };
}
