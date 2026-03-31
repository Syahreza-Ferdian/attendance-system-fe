import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { type ColumnDef } from "@tanstack/react-table";
import {
  Plus,
  Search,
  Pencil,
  UserPlus,
  Clock,
  Trash2Icon,
} from "lucide-react";
import useGetAllWorkSchedules from "@/services/work-schedule/useGetAllWorkSchedules";
import useDeleteWorkSchedule from "@/services/work-schedule/useDeleteWorkSchedule";
import type { WorkSchedule } from "@/types/work-schedule/work-schedule.types";
import WorkScheduleDayBadge from "@/components/Badge";
import Button from "@/components/Button";
import { CardBody, CardHeader, CardRoot } from "@/components/Card";
import { Input } from "@/components/Form";
import DataTable from "@/components/Table";
import PageHeader from "@/components/PageHeader";
import Swal from "sweetalert2";
import { useDebounce } from "@/lib/utils";

function fmtTime(t: string) {
  return t?.slice(0, 5) ?? "—";
}

export default function WorkSchedulePage() {
  const {
    loading,
    workSchedules,
    pagination,
    setPagination,
    setFilters,
    mutate,
  } = useGetAllWorkSchedules();
  const { deleteWorkSchedule } = useDeleteWorkSchedule();

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

  const handleDeleteWorkSchedule = useCallback(
    async (workScheduleID: string) => {
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
          await deleteWorkSchedule(workScheduleID, mutate);
          Swal.fire("Terhapus!", "Data jadwal kerja telah dihapus.", "success");
        } catch {
          Swal.fire(
            "Gagal!",
            "Terjadi kesalahan saat menghapus data.",
            "error",
          );
        }
      }
    },
    [deleteWorkSchedule, mutate],
  );

  const columns = useMemo<ColumnDef<WorkSchedule, unknown>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Nama Jadwal",
        cell: ({ row }) => (
          <div>
            <p className="font-semibold text-ink text-sm">
              {row.original.name ?? "—"}
            </p>
            {row.original.description && (
              <p className="text-xs text-ink-tertiary mt-0.5 truncate max-w-50">
                {row.original.description}
              </p>
            )}
          </div>
        ),
      },
      {
        id: "time",
        header: "Jam Kerja",
        cell: ({ row }) => (
          <div className="flex items-center gap-1.5 text-sm text-ink-secondary">
            <Clock size={13} className="text-ink-tertiary" />
            <span className="font-mono text-sm">
              {fmtTime(row.original.startTime)} –{" "}
              {fmtTime(row.original.endTime)}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "lateToleranceMinutes",
        header: "Toleransi Keterlambatan",
        cell: ({ getValue }) => (
          <span className="text-sm text-ink-secondary">
            {getValue() as number} menit
          </span>
        ),
      },
      {
        id: "days",
        header: "Hari Kerja",
        cell: ({ row }) => (
          <WorkScheduleDayBadge days={row.original.workScheduleDays ?? []} />
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
                  navigate(
                    `/hr/master-data/work-schedules/${row.original.id}/edit`,
                  )
                }
              >
                <Pencil size={18} />
              </Button>

              <Button
                variant="danger"
                size="sm"
                onClick={() => handleDeleteWorkSchedule(row.original.id)}
              >
                <Trash2Icon size={18} />
              </Button>
            </div>
          </>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <>
      <PageHeader
        title="Jadwal Kerja"
        subtitle="Kelola jadwal kerja dan assign ke karyawan."
        breadcrumbs={[
          { label: "Dashboard", href: "/hr/dashboard" },
          { label: "Jadwal Kerja" },
        ]}
        action={
          <div className="flex items-center gap-2">
            <Link to="/hr/master-data/work-schedules/assign">
              <Button variant="outline" leftIcon={<UserPlus size={15} />}>
                Assign ke Karyawan
              </Button>
            </Link>
            <Link to="/hr/master-data/work-schedules/create">
              <Button variant="primary" leftIcon={<Plus size={15} />}>
                Jadwal Baru
              </Button>
            </Link>
          </div>
        }
      />

      <CardRoot>
        <CardHeader
          title="Daftar Jadwal"
          subtitle={`Total: ${pagination.total} jadwal`}
        />

        <div className="px-5 py-3 border-b border-slate-100">
          <div className="w-64">
            <Input
              placeholder="Cari nama jadwal..."
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
            data={workSchedules}
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
            emptyMessage="Belum ada jadwal kerja. Buat jadwal baru untuk memulai."
          />
        </CardBody>
      </CardRoot>
    </>
  );
}
