import { Users, ClipboardCheck, CalendarX, Clock } from "lucide-react";
import { formatDate, formatTime } from "@lib/utils";
import { CardBody, CardHeader, CardRoot, StatCard } from "@/components/Card";
import PageHeader from "@/components/PageHeader";
import { AttendanceBadge } from "@/components/Badge";
import { type Attendance } from "@/types/attendance/attendance.types";
import useAuthStore from "@/store/useAuthStore";
import useGetAllAttendances from "@/services/attendance/useGetAllAttendances";
import DataTable from "@/components/Table";
import { useEffect, useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import useGetAttendanceStats from "@/services/attendance/useGetAttendanceStats";
import Button from "@/components/Button";
import { Link } from "react-router-dom";

export default function AdminDashboardPage() {
  const { user } = useAuthStore();

  console.log(new Date().toISOString().split("T")[0]);

  const { stats } = useGetAttendanceStats(
    new Date().toISOString().split("T")[0],
  );

  const statsData = useMemo(() => {
    if (!stats) return [];

    return [
      {
        label: "Total Karyawan",
        value: stats.totalEmployees,
        icon: <Users size={20} className="text-primary-600" />,
        iconBg: "bg-primary-50",
      },
      {
        label: "Hadir Hari Ini",
        value: stats.present,
        icon: <ClipboardCheck size={20} className="text-emerald-600" />,
        iconBg: "bg-emerald-50",
        trend: { value: `${stats.presentPercentage}% dari total karyawan` },
      },
      {
        label: "Terlambat/Tidak Hadir",
        value: stats.late,
        icon: <CalendarX size={20} className="text-red-500" />,
        iconBg: "bg-red-50",
        trend: { value: `${stats.latePercentage}% dari total karyawan` },
      },
    ];
  }, [stats]);

  // console.log("Stats:", statsData);

  const { attendance, loading, pagination, setFilters, setPagination } =
    useGetAllAttendances();

  useEffect(() => {
    setFilters((f) => ({
      ...f,
      workDate: new Date().toISOString().split("T")[0],
    }));

    setPagination((p) => ({
      ...p,
      currentPage: 1,
    }));
  }, [setFilters, setPagination]);

  const columns = useMemo<ColumnDef<Attendance, unknown>[]>(
    () => [
      {
        accessorKey: "user",
        header: "Karyawan",
        cell: ({ row }) => (
          <p className="font-medium text-ink text-[15px]">
            {row.original.user?.firstName} {row.original.user?.lastName}
          </p>
        ),
      },
      {
        // accessorKey: "user",
        header: "Jabatan",
        cell: ({ row }) => (
          <p className="font-medium text-ink text-[15px]">
            {row.original.user?.position.name}
          </p>
        ),
      },
      {
        // accessorKey: "user",
        header: "Divisi",
        cell: ({ row }) => (
          <p className="font-medium text-ink text-[15px]">
            {row.original.user?.position.division?.name}
          </p>
        ),
      },
      {
        id: "attendanceIn",
        header: "Jam Masuk",
        cell: ({ row }) => (
          <p className="font-medium text-ink text-[15px]">
            {formatTime(row.original.attendanceIn)}
          </p>
        ),
      },
      {
        id: "attendanceOut",
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
    ],
    [],
  );

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <PageHeader
          title="Dashboard"
          subtitle={`Selamat datang kembali, ${user?.firstName}! Berikut ringkasan absensi hari ini.`}
          breadcrumbs={[{ label: "Dashboard" }]}
        />
        <Link to="/employee/dashboard">
          <Button variant="primary" size="md" leftIcon={<Users size={16} />}>
            <span className="text-[15px]">Pindah ke dashboard karyawan</span>
          </Button>
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
        {statsData.map((s, i) => (
          <StatCard key={i} {...s} />
        ))}
      </div>

      {/* Recent Attendance */}
      <CardRoot>
        <CardHeader
          title="Absensi Hari Ini"
          subtitle={formatDate(new Date().toISOString(), {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
          action={
            <a
              href="/hr/attendance"
              className="text-xs text-primary-600 hover:underline font-medium"
            >
              Lihat semua →
            </a>
          }
        />
        <CardBody className="p-0">
          <DataTable
            columns={columns}
            data={attendance}
            loading={loading}
            pagination={pagination}
          ></DataTable>
        </CardBody>
      </CardRoot>
    </>
  );
}
