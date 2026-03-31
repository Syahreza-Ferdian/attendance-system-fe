import axiosInstance from "@/lib/axios";
import type { Division } from "@/types/division/division.types";
import type { Fetcher } from "swr";
import useSWR from "swr";

export default function useGetDivisionById(divisionId?: string) {
  const fetcher: Fetcher<Division, string> = async (url) => {
    const { data } = await axiosInstance({ withToken: true }).get(url);

    return data.data;
  };

  const { data, error, isLoading } = useSWR(
    divisionId ? `/divisions/${divisionId}` : null,
    fetcher,
  );

  return {
    division: data ?? null,
    loading: isLoading,
    error,
  };
}
