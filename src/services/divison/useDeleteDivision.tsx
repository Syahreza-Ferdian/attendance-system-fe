import axiosInstance from "@/lib/axios";

export default function useDeleteDivision() {
  const deleteDivision = async (
    divisionId: string,
    revalidate?: () => void,
  ) => {
    const response = await axiosInstance({ withToken: true }).delete(
      `/divisions/${divisionId}`,
    );

    if (response.status === 200) {
      revalidate?.();
    }

    return response;
  };

  return { deleteDivision };
}
