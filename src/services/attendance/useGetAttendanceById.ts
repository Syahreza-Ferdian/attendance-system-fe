import axiosInstance from "@/lib/axios";
import type { Attendance } from "@/types/attendance/attendance.types";
import type { Fetcher } from "swr";
import useSWR from "swr";

export default function useGetAttendance(attendanceId?: string) {
  const fetcher: Fetcher<Attendance, string> = async (url) => {
    const { data } = await axiosInstance({ withToken: true }).get(url);

    return data.data;
  };

  const { data, error, isLoading } = useSWR(
    attendanceId ? `/attendance/${attendanceId}` : null,
    fetcher,
  );

  return {
    attendance: data ?? null,
    loading: isLoading,
    error,
  };
}
