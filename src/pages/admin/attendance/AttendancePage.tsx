import { useEffect, useMemo, useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { Search, Filter, Eye } from "lucide-react";
import { formatDate, formatTime, useDebounce } from "@lib/utils";
import useGetAllAttendances from "@/services/attendance/useGetAllAttendances";
import {
  AttendanceStatus,
  type Attendance,
} from "@/types/attendance/attendance.types";
import { AttendanceBadge } from "@/components/Badge";
import PageHeader from "@/components/PageHeader";
import { CardBody, CardHeader, CardRoot } from "@/components/Card";
import CustomSelect, { Input } from "@/components/Form";
import DataTable from "@/components/Table";
import Button from "@/components/Button";
import { useNavigate } from "react-router-dom";

export default function AttendancePage() {
  const {
    loading,
    attendance,
    pagination,
    setPagination,
    filters,
    setFilters,
  } = useGetAllAttendances();

  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 1000);

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

  const columns = useMemo<ColumnDef<Attendance, unknown>[]>(
    () => [
      {
        header: "Tanggal",
        cell: ({ row }) => (
          <p className="font-medium text-ink">
            {formatDate(row.original.workDate)}
          </p>
        ),
      },
      {
        header: "Karyawan",
        cell: ({ row }) => (
          <p className="font-medium text-ink text-[15px]">
            {row.original.user?.firstName} {row.original.user?.lastName}
          </p>
        ),
      },
      {
        header: "Jabatan",
        cell: ({ row }) => (
          <p className="font-medium text-ink text-[15px]">
            {row.original.user?.position?.name}
          </p>
        ),
      },
      {
        header: "Divisi",
        cell: ({ row }) => (
          <p className="font-medium text-ink text-[15px]">
            {row.original.user?.position?.division?.name}
          </p>
        ),
      },
      {
        header: "Jam Masuk",
        cell: ({ row }) => (
          <p className="font-medium text-ink text-[15px]">
            {formatTime(row.original.attendanceIn)}
          </p>
        ),
      },
      {
        header: "Jam Keluar",
        cell: ({ row }) => (
          <p className="font-medium text-ink text-[15px]">
            {row.original.attendanceOut
              ? formatTime(row.original.attendanceOut)
              : "-"}
          </p>
        ),
      },
      {
        accessorKey: "status",
        header: "Status Absensi",
        cell: ({ row }) => <AttendanceBadge status={row.original.status} />,
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                navigate(`/hr/attendance/${row.original.id}/detail`)
              }
            >
              <Eye size={18} />
            </Button>
          </div>
        ),
      },
    ],
    [navigate],
  );

  return (
    <>
      <PageHeader
        title="Rekap Absensi"
        subtitle="Data kehadiran seluruh karyawan."
        breadcrumbs={[
          { label: "Dashboard", href: "/hr/dashboard" },
          { label: "Rekap Absensi" },
        ]}
      />

      <CardRoot>
        <CardHeader
          title="Daftar Absensi"
          subtitle={`Total: ${pagination.total} data`}
        />

        {/* Filters */}
        <div className="px-5 py-3 border-b border-slate-100 flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-2 text-xs text-ink-tertiary">
            <Filter size={14} />
            <span>Filter:</span>
          </div>
          <div className="w-52">
            <Input
              placeholder="Cari karyawan..."
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
              }}
              leftIcon={<Search size={14} />}
            />
          </div>
          <div className="w-44">
            <CustomSelect
              options={[
                { label: "Hadir", value: AttendanceStatus.PRESENT },
                { label: "Terlambat", value: AttendanceStatus.LATE },
              ]}
              placeholder="Pilih status"
              isClearable={true}
              value={
                filters.status
                  ? {
                      label:
                        filters.status === AttendanceStatus.PRESENT
                          ? "Hadir"
                          : "Terlambat",
                      value: filters.status,
                    }
                  : null
              }
              onChange={(selected) => {
                setFilters((f) => ({
                  ...f,
                  status: (selected?.value as AttendanceStatus) ?? null,
                }));
                setPagination((p) => ({ ...p, current_page: 1 }));
              }}
              styles={{
                control: (base) => ({
                  ...base,
                  height: 48,
                  minHeight: 48,
                  borderRadius: "12px",
                  borderColor: "#e2e8f0",
                }),
              }}
            />
          </div>
          <div className="flex gap-2">
            <Input
              type="date"
              value={filters.workDate}
              onChange={(e) =>
                setFilters((f) => ({ ...f, workDate: e.target.value }))
              }
            />
          </div>
        </div>

        <CardBody className="p-5">
          <DataTable
            columns={columns}
            data={attendance}
            loading={loading}
            pagination={pagination}
            onPageChange={(page) =>
              setPagination((p) => ({ ...p, current_page: page }))
            }
            onPerPageChange={(perPage) =>
              setPagination((p) => ({
                ...p,
                per_page: perPage,
                current_page: 1,
              }))
            }
            emptyMessage="Tidak ada data absensi yang ditemukan."
          />
        </CardBody>
      </CardRoot>
    </>
  );
}
