/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState, useCallback } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { UserPlus, Search, Pencil, Trash2Icon, Filter } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDebounce } from "@lib/utils";
import PageHeader from "@/components/PageHeader";
import DataTable from "@/components/Table";
import Button from "@/components/Button";
import { CardBody, CardHeader, CardRoot } from "@/components/Card";
import CustomSelect, { Input } from "@/components/Form";
import Swal from "sweetalert2";
import useGetAllPositions from "@/services/position/useGetAllPositions";
import useDeletePosition from "@/services/position/useDeletePosition";
import type { Position } from "@/types/position/position.types";
import useGetAllDivisions from "@/services/divison/useGetAllDivision";

export default function PositionPage() {
  const {
    loading,
    positions,
    pagination,
    filters,
    setPagination,
    setFilters,
    mutate,
  } = useGetAllPositions();

  const { loading: loadingDivisions, divisions } = useGetAllDivisions();

  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 1000);
  const { deletePosition } = useDeletePosition();
  const navigate = useNavigate();

  useEffect(() => {
    setFilters((f) => ({
      ...f,
      search: debouncedSearch || undefined,
    }));

    setPagination((p) => ({
      ...p,
      currentPage: 1,
    }));
  }, [debouncedSearch, setFilters, setPagination]);

  const divisionOptions = useMemo(() => {
    if (!divisions) return [];

    return divisions.map((division) => ({
      label: division.name,
      value: division.id,
    }));
  }, [divisions]);

  const handleDeletePosition = useCallback(
    async (positionId: string) => {
      const result = await Swal.fire({
        title: "Apakah Anda yakin?",
        text: "Tindakan ini tidak dapat dibatalkan.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Ya, hapus!",
        cancelButtonText: "Batal",
      });

      if (result.isConfirmed) {
        try {
          await deletePosition(positionId, mutate);
          Swal.fire("Terhapus!", "Data posisi telah dihapus.", "success");
        } catch {
          Swal.fire(
            "Gagal!",
            "Terjadi kesalahan saat menghapus data.",
            "error",
          );
        }
      }
    },
    [deletePosition, mutate],
  );

  const columns = useMemo<ColumnDef<Position, unknown>[]>(
    () => [
      {
        header: "Nama Posisi",
        cell: ({ row }) => (
          <p className="font-medium text-ink text-[15px]">
            {row.original.name}
          </p>
        ),
      },
      {
        header: "Divisi",
        cell: ({ row }) => (
          <p className="font-medium text-ink text-[15px]">
            {row.original.division?.name}
          </p>
        ),
      },
      {
        header: "Deskripsi",
        cell: ({ row }) => (
          <p className="font-medium text-ink text-[15px] truncate-2-lines">
            {row.original.description ?? "-"}
          </p>
        ),
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  navigate(`/hr/master-data/positions/${row.original.id}/edit`)
                }
              >
                <Pencil size={18} />
              </Button>

              <Button
                variant="danger"
                size="sm"
                onClick={() => handleDeletePosition(row.original.id)}
              >
                <Trash2Icon size={18} />
              </Button>
            </div>
          </>
        ),
      },
    ],
    [handleDeletePosition, navigate],
  );

  return (
    <>
      <PageHeader
        title="Posisi"
        subtitle="Kelola data seluruh posisi."
        breadcrumbs={[
          { label: "Dashboard", href: "/hr/dashboard" },
          { label: "Posisi" },
        ]}
        action={
          <Link to="/hr/master-data/positions/create">
            <Button leftIcon={<UserPlus size={15} />}>Tambah Posisi</Button>
          </Link>
        }
      />

      <CardRoot>
        <CardHeader
          title="Daftar Posisi"
          subtitle={`Total: ${pagination.total} posisi`}
        />

        <div className="px-5 py-3 border-b border-slate-100 flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-2 text-xs text-ink-tertiary">
            <Filter size={14} />
            <span>Filter:</span>
          </div>
          <div className="w-52">
            <Input
              placeholder="Cari posisi..."
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
              }}
              leftIcon={<Search size={14} />}
            />
          </div>
          <div className="w-44">
            <CustomSelect
              isLoading={loadingDivisions}
              options={divisionOptions}
              placeholder="Pilih divisi"
              isClearable={true}
              value={
                divisionOptions.find(
                  (opt) => opt.value === filters.divisionId,
                ) || null
              }
              onChange={(selected) => {
                setFilters((f) => ({
                  ...f,
                  divisionId: (selected?.value as string) ?? null,
                }));
                setPagination((p) => ({ ...p, current_page: 1 }));
              }}
            />
          </div>
        </div>

        <CardBody className="p-5">
          <DataTable
            columns={columns}
            data={positions}
            loading={loading}
            pagination={pagination}
            onPageChange={(page) =>
              setPagination((p: any) => ({ ...p, currentPage: page }))
            }
            onPerPageChange={(perPage) =>
              setPagination((p: any) => ({
                ...p,
                limit: perPage,
                currentPage: 1,
              }))
            }
            emptyMessage="Tidak ada posisi ditemukan."
          />
        </CardBody>
      </CardRoot>
    </>
  );
}
