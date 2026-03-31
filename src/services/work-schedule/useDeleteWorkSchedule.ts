import axiosInstance from "@/lib/axios";

export default function useDeleteWorkSchedule() {
  const deleteWorkSchedule = async (
    workScheduleId: string,
    revalidate?: () => void,
  ) => {
    const response = await axiosInstance({ withToken: true }).delete(
      `/work-schedules/${workScheduleId}`,
    );

    if (response.status === 200) {
      revalidate?.();
    }

    return response;
  };

  return { deleteWorkSchedule };
}
