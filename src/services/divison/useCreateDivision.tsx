/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "@/lib/axios";
import { jsonToFormData } from "@/lib/utils";
import type { ICreateDivisionPayload } from "@/types/division/division.types";

export default function useCreateDivision() {
  const createDivision = async (payload: ICreateDivisionPayload) => {
    const response = await axiosInstance({ withToken: true }).post(
      "/divisions",
      jsonToFormData(payload as { [key: string]: any }),
    );

    return response;
  };
  return { createDivision };
}
