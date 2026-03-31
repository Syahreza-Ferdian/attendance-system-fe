/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState, useCallback } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { UserPlus, Search, Pencil, Trash2Icon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDebounce } from "@lib/utils";
import { Badge } from "@/components/Badge";
import PageHeader from "@/components/PageHeader";
import DataTable from "@/components/Table";
import Button from "@/components/Button";
import { CardBody, CardHeader, CardRoot } from "@/components/Card";
import { Input } from "@/components/Form";
import Swal from "sweetalert2";
import useGetAllDivisions from "@/services/divison/useGetAllDivision";
import useDeleteDivision from "@/services/divison/useDeleteDivision";
import type { Division } from "@/types/division/division.types";

export default function DivisionPage() {
  const { loading, divisions, pagination, setPagination, setFilters, mutate } =
    useGetAllDivisions();

  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 1000);
  const { deleteDivision } = useDeleteDivision();
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

  const handleDeleteDivision = useCallback(
    async (divisionId: string) => {
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
          await deleteDivision(divisionId, mutate);
          Swal.fire("Terhapus!", "Data divisi telah dihapus.", "success");
        } catch {
          Swal.fire(
            "Gagal!",
            "Terjadi kesalahan saat menghapus data.",
            "error",
          );
        }
      }
    },
    [deleteDivision, mutate],
  );

  const columns = useMemo<ColumnDef<Division, unknown>[]>(
    () => [
      {
        header: "Nama Divisi",
        cell: ({ row }) => (
          <p className="font-medium text-ink text-[15px]">
            {row.original.name}
          </p>
        ),
      },
      {
        header: "Posisi pada Divisi",
        cell: ({ row }) =>
          row.original.positions && row.original.positions.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {row.original.positions.map((position) => (
                <Badge key={position.id} variant="default">
                  {position.name}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-ink-tertiary">Tidak ada posisi</p>
          ),
      },
      {
        header: "Deskripsi",
        cell: ({ row }) => (
          <p className="font-medium text-ink text-[15px] truncate-2-lines">
            {row.original.description}
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
                  navigate(`/hr/master-data/divisions/${row.original.id}/edit`)
                }
              >
                <Pencil size={18} />
              </Button>

              <Button
                variant="danger"
                size="sm"
                onClick={() => handleDeleteDivision(row.original.id)}
              >
                <Trash2Icon size={18} />
              </Button>
            </div>
          </>
        ),
      },
    ],
    [handleDeleteDivision, navigate],
  );

  return (
    <>
      <PageHeader
        title="Divisi"
        subtitle="Kelola data seluruh divisi."
        breadcrumbs={[
          { label: "Dashboard", href: "/hr/dashboard" },
          { label: "Divisi" },
        ]}
        action={
          <Link to="/hr/master-data/divisions/create">
            <Button leftIcon={<UserPlus size={15} />}>Tambah Divisi</Button>
          </Link>
        }
      />

      <CardRoot>
        <CardHeader
          title="Daftar Divisi"
          subtitle={`Total: ${pagination.total} divisi`}
        />

        {/* Search filter */}
        <div className="px-5 py-3 border-b border-slate-100">
          <div className="w-64">
            <Input
              placeholder="Cari nama divisi..."
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
              }}
              leftIcon={<Search size={14} />}
            />
          </div>
        </div>

        <CardBody className="p-5">
          <DataTable
            columns={columns}
            data={divisions}
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
            emptyMessage="Tidak ada divisi ditemukan."
          />
        </CardBody>
      </CardRoot>
    </>
  );
}
