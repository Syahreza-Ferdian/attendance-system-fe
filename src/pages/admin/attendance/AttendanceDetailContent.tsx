import {
  MapPin,
  Clock,
  LogIn,
  LogOut,
  User,
  CalendarDays,
  Briefcase,
  ShieldCheck,
  Image as ImageIcon,
  ExternalLink,
  Navigation,
} from "lucide-react";
import { cm, getImageUrl } from "@lib/utils";
import { getInitials } from "@lib/utils";
import type { Attendance } from "@/types/attendance/attendance.types";
import { CardBody, CardHeader, CardRoot } from "@/components/Card";
import { AttendanceBadge } from "@/components/Badge";

// ─── helpers ─────────────────────────────────────────────────────────────────
function fmtTime(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

function calcDuration(inIso: string, outIso: string | null): string {
  if (!outIso) return "—";
  const ms = new Date(outIso).getTime() - new Date(inIso).getTime();
  if (ms <= 0) return "—";
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  return `${h} jam ${m} menit`;
}

function mapsUrl(latLng: string): string {
  const [lat, lng] = latLng.split(",").map(Number);
  return `https://www.google.com/maps?q=${lat},${lng}`;
}

function InfoRow({
  label,
  value,
  mono,
  icon,
}: {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="flex items-center gap-1.5 text-xs text-ink-tertiary shrink-0">
        {icon && <span>{icon}</span>}
        {label}
      </div>
      <span
        className={cm(
          "text-xs font-medium text-ink text-right max-w-[55%] wrap-break-word",
          mono && "font-mono bg-slate-100 px-1.5 py-0.5 rounded-md",
        )}
      >
        {value}
      </span>
    </div>
  );
}

function TimeBlock({
  label,
  time,
  color,
  icon,
  active,
}: {
  label: string;
  time: string | null;
  color: "emerald" | "blue";
  icon: React.ReactNode;
  active: boolean;
}) {
  const palette = {
    emerald: {
      wrap: active
        ? "bg-emerald-50 border-emerald-200"
        : "bg-slate-50 border-slate-200",
      icon: active
        ? "bg-emerald-100 text-emerald-600"
        : "bg-slate-100 text-slate-400",
      label: active ? "text-emerald-600" : "text-ink-tertiary",
      time: active ? "text-emerald-800" : "text-slate-300",
    },
    blue: {
      wrap: active
        ? "bg-blue-50 border-blue-200"
        : "bg-slate-50 border-slate-200",
      icon: active
        ? "bg-blue-100 text-blue-600"
        : "bg-slate-100 text-slate-400",
      label: active ? "text-blue-600" : "text-ink-tertiary",
      time: active ? "text-blue-800" : "text-slate-300",
    },
  }[color];

  return (
    <div
      className={cm(
        "rounded-xl border p-4 flex items-center gap-3.5",
        palette.wrap,
      )}
    >
      <div
        className={cm(
          "w-9 h-9 rounded-xl flex items-center justify-center shrink-0",
          palette.icon,
        )}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className={cm("text-xs font-medium mb-0.5", palette.label)}>
          {label}
        </p>
        <p
          className={cm(
            "text-lg font-bold tabular-nums leading-tight",
            palette.time,
          )}
        >
          {active && time ? fmtTime(time) : "—:——:——"}
        </p>
      </div>
    </div>
  );
}

function LocationBlock({
  label,
  latLng,
  color,
}: {
  label: string;
  latLng: string | null;
  color: "emerald" | "blue";
}) {
  const palette = {
    emerald: {
      wrap: latLng
        ? "bg-emerald-50 border-emerald-200"
        : "bg-slate-50 border-slate-200",
      icon: latLng ? "text-emerald-600" : "text-slate-400",
      label: latLng ? "text-emerald-600" : "text-ink-tertiary",
      coord: latLng ? "text-emerald-900" : "text-slate-300",
    },
    blue: {
      wrap: latLng
        ? "bg-blue-50 border-blue-200"
        : "bg-slate-50 border-slate-200",
      icon: latLng ? "text-blue-600" : "text-slate-400",
      label: latLng ? "text-blue-600" : "text-ink-tertiary",
      coord: latLng ? "text-blue-900" : "text-slate-300",
    },
  }[color];

  return (
    <div className={cm("rounded-xl border p-4", palette.wrap)}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <MapPin size={13} className={palette.icon} />
          <p className={cm("text-xs font-semibold", palette.label)}>{label}</p>
        </div>
        {latLng && (
          <a
            href={mapsUrl(latLng)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[11px] text-primary-600 hover:underline"
          >
            <Navigation size={11} />
            Buka Maps
          </a>
        )}
      </div>
      {latLng ? (
        <p className={cm("font-mono text-xs break-all", palette.coord)}>
          {latLng}
        </p>
      ) : (
        <p className="text-xs text-slate-400 italic">Tidak ada data lokasi</p>
      )}
    </div>
  );
}

function ProofImage({
  label,
  url,
  color,
}: {
  label: string;
  url: string | null;
  color: "emerald" | "blue";
}) {
  const accentLabel =
    color === "emerald" ? "text-emerald-600" : "text-blue-600";
  const accentBg =
    color === "emerald"
      ? "bg-emerald-50 border-emerald-200"
      : "bg-blue-50 border-blue-200";

  return (
    <div className="flex flex-col gap-2">
      <p
        className={cm(
          "text-xs font-semibold",
          url ? accentLabel : "text-ink-tertiary",
        )}
      >
        {label}
      </p>
      {url ? (
        <div className="relative rounded-xl overflow-hidden border border-slate-200 group">
          <img
            src={getImageUrl(url)}
            alt={label}
            className="w-full h-44 object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <a
            href={getImageUrl(url)}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100"
          >
            <div className="flex items-center gap-1.5 bg-white rounded-lg px-3 py-1.5 shadow-lg">
              <ExternalLink size={13} className="text-ink" />
              <span className="text-xs font-medium text-ink">Lihat Penuh</span>
            </div>
          </a>
        </div>
      ) : (
        <div
          className={cm(
            "rounded-xl border-2 border-dashed flex flex-col items-center justify-center h-44 gap-2",
            accentBg,
          )}
        >
          <ImageIcon size={24} className="text-slate-300" />
          <p className="text-xs text-slate-400 italic">Tidak ada foto</p>
        </div>
      )}
    </div>
  );
}

interface Props {
  attendance: Attendance;
}

export default function AttendanceDetailContent({ attendance }: Props) {
  const hasIn = !!attendance.attendanceIn;
  const hasOut = !!attendance.attendanceOut;

  const fullName = attendance.user
    ? `${attendance.user.firstName} ${attendance.user.lastName}`
    : attendance.userId;

  return (
    <div className="grid grid-cols-12 gap-5">
      {/* ── Kolom kiri (8/12) ── */}
      <div className="col-span-12 lg:col-span-8 flex flex-col gap-5">
        {/* Card: identitas karyawan + status */}
        <CardRoot>
          <CardBody className="flex flex-col sm:flex-row sm:items-start gap-5">
            {/* Avatar */}
            <div className="shrink-0">
              {attendance.user?.profileImage ? (
                <img
                  src={getImageUrl(attendance.user.profileImage)}
                  alt={fullName}
                  className="w-16 h-16 rounded-2xl object-cover border border-slate-200"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-xl">
                  {getInitials(fullName)}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
                <h2 className="text-xl font-bold text-ink truncate">
                  {fullName}
                </h2>
                <AttendanceBadge status={attendance.status} />
              </div>
              {attendance.user?.position && (
                <p className="text-sm text-ink-secondary mb-0.5">
                  {attendance.user.position.name}
                </p>
              )}
              {attendance.user?.username && (
                <p className="text-xs text-ink-tertiary font-mono">
                  @{attendance.user.username}
                </p>
              )}
              <p className="text-xs text-ink-tertiary mt-2 flex items-center gap-1.5">
                <CalendarDays size={12} />
                {new Date(attendance.workDate).toLocaleDateString("id-ID", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </CardBody>
        </CardRoot>

        {/* Card: waktu check-in & check-out */}
        <CardRoot>
          <CardHeader
            title="Waktu Kehadiran"
            subtitle={
              hasIn && hasOut
                ? `Durasi: ${calcDuration(attendance.attendanceIn, attendance.attendanceOut)}`
                : hasIn
                  ? "Belum check out"
                  : "Belum ada data"
            }
          />
          <CardBody className="flex flex-col gap-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <TimeBlock
                label="Check In"
                time={attendance.attendanceIn}
                active={hasIn}
                color="emerald"
                icon={<LogIn size={16} />}
              />
              <TimeBlock
                label="Check Out"
                time={attendance.attendanceOut}
                active={hasOut}
                color="blue"
                icon={<LogOut size={16} />}
              />
            </div>

            {hasIn && hasOut && (
              <div className="mt-1 flex items-center gap-3 rounded-xl bg-slate-50 border border-slate-200 px-4 py-3">
                <Clock size={14} className="text-ink-tertiary shrink-0" />
                <div className="flex-1">
                  <p className="text-xs text-ink-tertiary mb-1">
                    Total jam kerja
                  </p>
                  <p className="text-sm font-bold text-ink">
                    {calcDuration(
                      attendance.attendanceIn,
                      attendance.attendanceOut,
                    )}
                  </p>
                </div>
              </div>
            )}
          </CardBody>
        </CardRoot>

        {/* Card: lokasi */}
        <CardRoot>
          <CardHeader
            title="Lokasi Absensi"
            subtitle="Koordinat GPS saat check in dan check out"
          />
          <CardBody className="flex flex-col sm:grid sm:grid-cols-2 gap-3">
            <LocationBlock
              label="Lokasi Check In"
              latLng={attendance.locationIn || null}
              color="emerald"
            />
            <LocationBlock
              label="Lokasi Check Out"
              latLng={attendance.locationOut || null}
              color="blue"
            />
          </CardBody>
        </CardRoot>
      </div>

      {/* ── Kolom kanan (4/12) ── */}
      <div className="col-span-12 lg:col-span-4 flex flex-col gap-5">
        {/* Card: foto bukti */}
        <CardRoot>
          <CardHeader title="Foto Bukti Absensi" />
          <CardBody className="flex flex-col gap-4">
            <ProofImage
              label="Foto Check In"
              url={attendance.proofImageIn || null}
              color="emerald"
            />
            <ProofImage
              label="Foto Check Out"
              url={attendance.proofImageOut || null}
              color="blue"
            />
          </CardBody>
        </CardRoot>

        {/* Card: info karyawan */}
        <CardRoot>
          <CardHeader title="Info Karyawan" />
          <CardBody className="flex flex-col gap-3">
            <InfoRow
              label="Username"
              value={attendance.user?.username ?? "—"}
              mono
              icon={<User size={11} />}
            />
            <InfoRow
              label="Email"
              value={attendance.user?.email ?? "—"}
              icon={<User size={11} />}
            />
            <InfoRow
              label="Posisi"
              value={attendance.user?.position?.name ?? "—"}
              icon={<Briefcase size={11} />}
            />
            <InfoRow
              label="Role"
              value={attendance.user?.role?.name ?? "—"}
              icon={<ShieldCheck size={11} />}
            />
          </CardBody>
        </CardRoot>

        {/* Card: ringkasan rekaman */}
        <CardRoot>
          <CardHeader title="Ringkasan Rekaman" />
          <CardBody className="flex flex-col gap-3">
            <InfoRow label="ID Absensi" value={attendance.id} mono />
            <InfoRow
              label="Status"
              value={
                <span
                  className={cm(
                    "inline-flex items-center gap-1 font-semibold text-[11px]",
                    attendance.status === "PRESENT" && "text-status-present",
                    attendance.status === "LATE" && "text-status-late",
                  )}
                >
                  {attendance.status === "PRESENT" && "Hadir"}
                  {attendance.status === "LATE" && "Terlambat"}
                </span>
              }
            />
            <InfoRow
              label="Tanggal Kerja"
              value={new Date(attendance.workDate).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            />
            <InfoRow
              label="Check In"
              value={hasIn ? fmtTime(attendance.attendanceIn) : "—"}
              mono={hasIn}
            />
            <InfoRow
              label="Check Out"
              value={hasOut ? fmtTime(attendance.attendanceOut) : "—"}
              mono={hasOut}
            />
            {hasIn && hasOut && (
              <InfoRow
                label="Durasi"
                value={calcDuration(
                  attendance.attendanceIn,
                  attendance.attendanceOut,
                )}
              />
            )}
          </CardBody>
        </CardRoot>
      </div>
    </div>
  );
}
