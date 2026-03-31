import PageHeader from "@/components/PageHeader";
import useGetAttendance from "@/services/attendance/useGetAttendanceById";
import { useParams } from "react-router-dom";
import AttendanceDetailContent from "./AttendanceDetailContent";
import { AlertCircle, Link } from "lucide-react";

export default function AttendanceDetailPage() {
  const { attendanceId } = useParams<{ attendanceId: string }>();

  const { attendance } = useGetAttendance(attendanceId);

  return (
    <>
      <PageHeader
        title="Lihat Detail Absensi Karyawan"
        subtitle={
          "Lihat informasi detail absensi karyawan, termasuk waktu masuk, waktu keluar, dan status kehadiran."
        }
        breadcrumbs={[
          { label: "Dashboard", href: "/hr/dashboard" },
          { label: "Absensi", href: "/hr/attendance" },
          { label: "Detail Absensi" },
        ]}
      />

      {!attendance ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
            <AlertCircle size={24} className="text-slate-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-ink">
              Data tidak ditemukan
            </p>
            <p className="text-xs text-ink-tertiary mt-1">
              Absensi dengan ID ini tidak tersedia.
            </p>
          </div>
          {/* <Link to="/hr/attendance">
            <Button variant="outline" size="sm">
              Kembali ke Daftar
            </Button>
          </Link> */}
        </div>
      ) : (
        <AttendanceDetailContent attendance={attendance} />
      )}
    </>
  );
}
