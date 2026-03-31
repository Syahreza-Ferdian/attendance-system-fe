import axiosInstance from "@/lib/axios";

export default function useDeleteUser() {
  const deleteUser = async (userId: string, revalidate?: () => void) => {
    const response = await axiosInstance({ withToken: true }).delete(
      `/users/${userId}`,
    );

    if (response.status === 200) {
      revalidate?.();
    }

    return response;
  };

  return { deleteUser };
}
