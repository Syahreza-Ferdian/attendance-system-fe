import axiosInstance from "@/lib/axios";
import { jsonToFormData } from "@/lib/utils";
import type { IUpdateDivisionPayload } from "@/types/division/division.types";

export default function useUpdateDivision() {
  const updateDivision = async (
    divisionId: string,
    payload: IUpdateDivisionPayload,
  ) => {
    const response = await axiosInstance({ withToken: true }).patch(
      `/divisions/${divisionId}`,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      jsonToFormData(payload as { [key: string]: any }),
    );

    return response;
  };

  return { updateDivision };
}
