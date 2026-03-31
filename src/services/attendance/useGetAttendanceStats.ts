import useSWR, { type Fetcher } from "swr";
import { axiosInstance } from "@lib/axios";

export interface AttendanceStatsResponse {
  present: number;
  late: number;
  totalEmployees: number;
  presentPercentage: number;
  latePercentage: number;
}

export default function useGetAttendanceStats(dateString?: string) {
  const fetcher: Fetcher<AttendanceStatsResponse, string> = async (url) => {
    const { data } = await axiosInstance({ withToken: true }).get(url);

    return data.data;
  };

  // console.log(dateString ? `/attendance/stats?date=${dateString}` : null);

  const { data, error, isLoading, mutate } = useSWR(
    dateString ? `/attendance/stats?date=${dateString}` : null,
    fetcher,
  );

  return {
    loading: isLoading,
    stats: data ?? null,
    error,
    mutate,
  };
}
