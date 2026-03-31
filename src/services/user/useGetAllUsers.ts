import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import useSWR, { type Fetcher } from "swr";
import { axiosInstance } from "@lib/axios";
import type {
  PaginatedResponse,
  Pagination,
} from "@/types/pagination/pagination.types";
import type { User } from "@/types/user/user.types";
import { cleanObject } from "@/lib/utils";
// import type { Employee, Pagination, PaginatedResponse } from "@types/index";

interface Filters {
  search?: string;
  positionId?: string;
  divisionId?: string;
  roleId?: string;
}

interface Props {
  withoutQueryString?: boolean;
}

export default function useGetAllUsers(options?: Props) {
  const [query, setQuery] = useSearchParams();

  const [pagination, setPagination] = useState<Pagination>({
    currentPage: parseInt(query.get("page") || "1"),
    lastPage: 1,
    limit: parseInt(query.get("limit") || "10"),
    total: 0,
  });

  const [filters, setFilters] = useState<Filters>({
    search: query.get("search") || undefined,
    positionId: query.get("positionId") || undefined,
    divisionId: query.get("divisionId") || undefined,
    roleId: query.get("roleId") || undefined,
  });

  useEffect(() => {
    if (options?.withoutQueryString) return;

    const updated = new URLSearchParams(query);
    let changed = false;

    const params: Record<string, string | number> = {
      page: pagination.currentPage,
      limit: pagination.limit,
      ...filters,
    };

    Object.entries(params).forEach(([key, value]) => {
      const str = String(value);
      if (!value || str === "") {
        if (updated.has(key)) {
          updated.delete(key);
          changed = true;
        }
      } else if (updated.get(key) !== str) {
        updated.set(key, str);
        changed = true;
      }
    });

    if (changed) setQuery(updated);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.currentPage, pagination.limit, filters]);

  const fetcher: Fetcher<
    PaginatedResponse<User>,
    { url: string; payload: object }
  > = async ({ url, payload }) => {
    const { data } = await axiosInstance({ withToken: true }).get(url, {
      params: payload,
    });
    if (data.data.pagination) setPagination(data.data.pagination);
    return data.data;
  };

  const { data, error, isLoading, mutate } = useSWR(
    {
      url: "/users/all",
      payload: cleanObject({
        page: pagination.currentPage,
        limit: pagination.limit,
        ...filters,
      }),
    },
    fetcher,
  );

  return {
    loading: isLoading,
    users: data?.data ?? [],
    error,
    pagination,
    setPagination,
    filters,
    setFilters,
    mutate,
  };
}
