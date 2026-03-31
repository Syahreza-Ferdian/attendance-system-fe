import useSWR, { type Fetcher } from "swr";
import { axiosInstance } from "@lib/axios";

export interface UserAttendanceStatsResponse {
  presentThisMonth: number;
  presentLastMonth: number;
  lateThisMonth: number;
  lateLastMonth: number;
}

export default function useGetUSerAttendanceStats() {
  const fetcher: Fetcher<UserAttendanceStatsResponse, string> = async (url) => {
    const { data } = await axiosInstance({ withToken: true }).get(url);

    return data.data;
  };

  const { data, error, isLoading, mutate } = useSWR(
    "/attendance/user/stats",
    fetcher,
  );

  return {
    loading: isLoading,
    stats: data ?? null,
    error,
    mutate,
  };
}
