import axiosInstance from "@/lib/axios";
import type { WorkSchedule } from "@/types/work-schedule/work-schedule.types";
import type { Fetcher } from "swr";
import useSWR from "swr";

export default function useGetWorkScheduleById(workScheduleId?: string) {
  const fetcher: Fetcher<WorkSchedule, string> = async (url) => {
    const { data } = await axiosInstance({ withToken: true }).get(url);

    return data.data;
  };

  const { data, error, isLoading } = useSWR(
    workScheduleId ? `/work-schedules/${workScheduleId}` : null,
    fetcher,
  );

  return {
    workSchedule: data ?? null,
    loading: isLoading,
    error,
  };
}
