/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "@/lib/axios";
import { jsonToFormData } from "@/lib/utils";
import type { ICreatePositionPayload } from "@/types/position/position.types";

export default function useCreatePosition() {
  const createPosition = async (payload: ICreatePositionPayload) => {
    const response = await axiosInstance({ withToken: true }).post(
      "/positions",
      jsonToFormData(payload as { [key: string]: any }),
    );

    return response;
  };
  return { createPosition };
}
