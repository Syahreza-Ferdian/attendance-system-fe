/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState, useCallback } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { UserPlus, Search, Pencil, Trash2Icon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { getImageUrl, getInitials, useDebounce } from "@lib/utils";
import { Badge } from "@/components/Badge";
import PageHeader from "@/components/PageHeader";
import DataTable from "@/components/Table";
import type { User } from "@/types/user/user.types";
import { UserRoleType } from "@/types/user/user-role.types";
import Button from "@/components/Button";
import { CardBody, CardHeader, CardRoot } from "@/components/Card";
import { Input } from "@/components/Form";
import useGetAllUsers from "@/services/user/useGetAllUsers";
import useDeleteUser from "@/services/user/useDeleteUser";
import Swal from "sweetalert2";

export default function EmployeePage() {
  const { loading, users, pagination, setPagination, setFilters, mutate } =
    useGetAllUsers();

  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 1000);
  const { deleteUser } = useDeleteUser();
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

  const handleDeleteUser = useCallback(
    async (userID: string) => {
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
          await deleteUser(userID, mutate);
          Swal.fire("Terhapus!", "Data karyawan telah dihapus.", "success");
        } catch {
          Swal.fire(
            "Gagal!",
            "Terjadi kesalahan saat menghapus data.",
            "error",
          );
        }
      }
    },
    [deleteUser, mutate],
  );

  const handleEditUser = useCallback(
    (userID: string) => {
      navigate(`/hr/master-data/employees/${userID}/edit`);
    },
    [navigate],
  );

  const columns = useMemo<ColumnDef<User, unknown>[]>(
    () => [
      {
        accessorKey: "firstName",
        header: "Karyawan",
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-xs font-bold shrink-0 overflow-hidden">
              {/* {getInitials(
                row.original.firstName + " " + row.original.lastName,
              )} */}
              {row.original.profileImage ? (
                <img
                  src={getImageUrl(row.original.profileImage)}
                  alt="profile-picture"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>
                  {getInitials(
                    row.original.firstName + " " + row.original.lastName,
                  )}
                </span>
              )}
            </div>
            <div>
              <p className="font-medium text-ink">
                {row.original.firstName} {row.original.lastName}
              </p>
              <p className="text-xs text-ink-tertiary">{row.original.email}</p>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "position",
        header: "Jabatan",
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <div>
              <p className="font-medium text-ink">
                {row.original.position.name}
              </p>
              <p className="text-xs text-ink-tertiary">
                Divisi {row.original.position.division?.name}
              </p>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "phoneNumber",
        header: "No. Telepon",
        cell: ({ row }) => (
          <p className="font-medium text-ink text-[15px]">
            {row.original.phoneNumber || "-"}
          </p>
        ),
      },
      {
        accessorKey: "role",
        header: "Status",
        cell: ({ row }) =>
          row.original.role.name === UserRoleType.HR ? (
            <Badge variant="success">HR</Badge>
          ) : (
            <Badge variant="info">Employee</Badge>
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
                onClick={() => handleEditUser(row.original.id)}
              >
                <Pencil size={18} />
              </Button>

              <Button
                variant="danger"
                size="sm"
                onClick={() => handleDeleteUser(row.original.id)}
              >
                <Trash2Icon size={18} />
              </Button>
            </div>
          </>
        ),
      },
    ],
    [handleDeleteUser, handleEditUser],
  );

  return (
    <>
      <PageHeader
        title="Karyawan"
        subtitle="Kelola data seluruh karyawan."
        breadcrumbs={[
          { label: "Dashboard", href: "/hr/dashboard" },
          { label: "Karyawan" },
        ]}
        action={
          <Link to="/hr/master-data/employees/create">
            <Button leftIcon={<UserPlus size={15} />}>Tambah Karyawan</Button>
          </Link>
        }
      />

      <CardRoot>
        <CardHeader
          title="Daftar Karyawan"
          subtitle={`Total: ${pagination.total} karyawan`}
        />

        {/* Search filter */}
        <div className="px-5 py-3 border-b border-slate-100">
          <div className="w-64">
            <Input
              placeholder="Cari nama atau email..."
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
            data={users}
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
            emptyMessage="Tidak ada karyawan ditemukan."
          />
        </CardBody>
      </CardRoot>
    </>
  );
}
