import axiosInstance from "@/lib/axios";

export default function useDeletePosition() {
  const deletePosition = async (
    positionId: string,
    revalidate?: () => void,
  ) => {
    const response = await axiosInstance({ withToken: true }).delete(
      `/positions/${positionId}`,
    );

    if (response.status === 200) {
      revalidate?.();
    }

    return response;
  };

  return { deletePosition };
}
