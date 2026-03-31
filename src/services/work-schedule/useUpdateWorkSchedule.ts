import axiosInstance from "@/lib/axios";
import { jsonToFormData } from "@/lib/utils";
import type { IUpdateWorkSchedulePayload } from "@/types/work-schedule/work-schedule.types";

export default function useUpdateWorkSchedule() {
  const updateWorkSchedule = async (
    workScheduleId: string,
    payload: IUpdateWorkSchedulePayload,
  ) => {
    const response = await axiosInstance({ withToken: true }).patch(
      `/work-schedules/${workScheduleId}`,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      jsonToFormData(payload as { [key: string]: any }),
    );

    return response;
  };

  return { updateWorkSchedule };
}
