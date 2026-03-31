import PageHeader from "@/components/PageHeader";
import { CheckCircle, CalendarX, Users } from "lucide-react";
import ClockWidget from "./ClockWidget";
import { StatCard } from "@/components/Card";
import AttendanceCard from "./AttendanceCard";
import AttendanceHistoryCard from "./AttendanceHistoryCard";
import useGetUserLastWeekAttendance from "@/services/attendance/useGetUserLastWeekAttendance";
import useGetUSerAttendanceStats from "@/services/attendance/useGetUserAttandanceStats";
import { useMemo } from "react";
import useAuthStore from "@/store/useAuthStore";
import { Link } from "react-router-dom";
import Button from "@/components/Button";
import { UserRoleType } from "@/types/user/user-role.types";

export default function EmployeeDashboardPage() {
  const { lastWeek, loading, mutate } = useGetUserLastWeekAttendance();

  const { stats } = useGetUSerAttendanceStats();

  const { user } = useAuthStore();

  const statsData = useMemo(() => {
    if (!stats) return [];

    return [
      {
        label: "Hadir Bulan Ini",
        value: stats.presentThisMonth,
        icon: <CheckCircle size={18} className="text-emerald-600" />,
        iconBg: "bg-emerald-50",
      },
      {
        label: "Terlambat Hadir Bulan Ini",
        value: stats.lateThisMonth,
        icon: <CalendarX size={18} className="text-red-500" />,
        iconBg: "bg-red-50",
      },
      {
        label: "Hadir Bulan Lalu",
        value: stats.presentLastMonth,
        icon: <CheckCircle size={18} className="text-emerald-600" />,
        iconBg: "bg-emerald-50",
      },
      {
        label: "Terlambat Hadir Bulan Lalu",
        value: stats.lateLastMonth,
        icon: <CalendarX size={18} className="text-red-500" />,
        iconBg: "bg-red-50",
      },
    ];
  }, [stats]);

  return (
    <>
      {/* <PageHeader
        title="Dashboard"
        subtitle="Selamat datang! Jangan lupa absensi hari ini."
        breadcrumbs={[{ label: "Dashboard" }]}
      /> */}

      <div className="flex justify-between items-center mb-6">
        <PageHeader
          title="Dashboard"
          subtitle={`Selamat datang kembali, ${user?.firstName}! Berikut ringkasan absensi hari ini.`}
          breadcrumbs={[{ label: "Dashboard" }]}
        />

        {user?.role.name === UserRoleType.HR && (
          <Link to="/hr/dashboard">
            <Button variant="primary" size="md" leftIcon={<Users size={16} />}>
              <span className="text-[15px]">Pindah ke dashboard HR</span>
            </Button>
          </Link>
        )}
      </div>

      <div className="mb-5">
        <ClockWidget />
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 mb-5">
        {statsData.map((s, i) => (
          <StatCard key={i} {...s} />
        ))}
      </div>

      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12 lg:col-span-5">
          <AttendanceCard />
        </div>
        <div className="col-span-12 lg:col-span-7">
          <AttendanceHistoryCard records={lastWeek} loading={loading} />
        </div>
      </div>
    </>
  );
}
