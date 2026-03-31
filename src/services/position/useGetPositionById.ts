import axiosInstance from "@/lib/axios";
import type { Position } from "@/types/position/position.types";
import type { Fetcher } from "swr";
import useSWR from "swr";

export default function useGetPositionById(positionId?: string) {
  const fetcher: Fetcher<Position, string> = async (url) => {
    const { data } = await axiosInstance({ withToken: true }).get(url);

    return data.data;
  };

  const { data, error, isLoading } = useSWR(
    positionId ? `/positions/${positionId}` : null,
    fetcher,
  );

  return {
    position: data ?? null,
    loading: isLoading,
    error,
  };
}
