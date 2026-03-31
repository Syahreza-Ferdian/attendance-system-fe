import axiosInstance from "@/lib/axios";
import { jsonToFormData } from "@/lib/utils";
import type { IUpdateUserPayload } from "@/types/user/user.types";

export default function useUpdateUser() {
  const updateUser = async (userId: string, payload: IUpdateUserPayload) => {
    const response = await axiosInstance({ withToken: true }).patch(
      `/users/${userId}`,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      jsonToFormData(payload as { [key: string]: any }),
    );

    return response;
  };

  return { updateUser };
}
