import axiosInstance from "@/lib/axios";
import { jsonToFormData } from "@/lib/utils";
import type { ICreateUserPayload } from "@/types/user/user.types";

export default function useCreateUser() {
  const createUser = async (payload: ICreateUserPayload) => {
    const response = await axiosInstance({ withToken: true }).post(
      "/users",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      jsonToFormData(payload as { [key: string]: any }),
    );

    return response;
  };

  return { createUser };
}
