/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "@/lib/axios";
import { jsonToFormData } from "@/lib/utils";
import type { ICreateWorkSchedulePayload } from "@/types/work-schedule/work-schedule.types";

export default function useCreateWorkSchedule() {
  const createWorkSchedule = async (payload: ICreateWorkSchedulePayload) => {
    const response = await axiosInstance({ withToken: true }).post(
      "/work-schedules",
      jsonToFormData(payload as { [key: string]: any }),
    );

    return response;
  };
  return { createWorkSchedule };
}
