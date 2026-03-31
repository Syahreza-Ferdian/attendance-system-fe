import axiosInstance from "@/lib/axios";
import { jsonToFormData } from "@/lib/utils";
import type { IUpdatePositionPayload } from "@/types/position/position.types";

export default function useUpdatePosition() {
  const updatePosition = async (
    positionId: string,
    payload: IUpdatePositionPayload,
  ) => {
    const response = await axiosInstance({ withToken: true }).patch(
      `/positions/${positionId}`,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      jsonToFormData(payload as { [key: string]: any }),
    );

    return response;
  };

  return { updatePosition };
}
