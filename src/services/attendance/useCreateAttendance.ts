/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "@/lib/axios";
import { jsonToFormData } from "@/lib/utils";
import type { ICreateAttendancePayload } from "@/types/attendance/attendance.types";

export default function useCreateAttendance() {
  const clockIn = async (payload: ICreateAttendancePayload) => {
    const response = await axiosInstance({ withToken: true }).post(
      "/attendance/clock-in",
      jsonToFormData(payload as { [key: string]: any }),
    );

    return response;
  };

  const clockOut = async (payload: ICreateAttendancePayload) => {
    const response = await axiosInstance({ withToken: true }).post(
      "/attendance/clock-out",
      jsonToFormData(payload as { [key: string]: any }),
    );

    return response;
  };

  return { clockIn, clockOut };
}
