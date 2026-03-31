/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "@/lib/axios";
import { jsonToFormData } from "@/lib/utils";
import type { IAssignWorkSchedulePayload } from "@/types/work-schedule/work-schedule.types";

export default function useAssignWorkSchedule() {
  const assignWorkSchedule = async (payload: IAssignWorkSchedulePayload) => {
    const response = await axiosInstance({ withToken: true }).post(
      "/work-schedules/assign",
      jsonToFormData(payload as { [key: string]: any }),
    );

    return response;
  };
  return { assignWorkSchedule };
}
