import { useState } from "react";
import {
  MapPin,
  Camera,
  CheckCircle2,
  LogIn,
  LogOut,
  AlertTriangle,
  Loader2,
  RefreshCw,
  X,
} from "lucide-react";
import { isAxiosError } from "axios";
import CameraModal from "./CameraModal";
import { toAttendanceUIState } from "@/types/attendance/attendance.types";
import { cm, getImageUrl } from "@lib/utils";
import useGetTodayAttendance from "@/services/attendance/useGetUserTodayAttendance";
import useCreateAttendance from "@/services/attendance/useCreateAttendance";
import useGeolocation from "@/services/employee/useGeolocation";
import { CardBody, CardHeader, CardRoot } from "@/components/Card";
import Button from "@/components/Button";
import { useReverseGeocode } from "@/services/location/useReverseGeocode";
import Swal from "sweetalert2";
import useRevalidateMutation from "@/lib/swr";

// Format jam dari ISO string, misal "2025-03-31T08:02:00.000Z" → "08:02"
function formatTimeFromISO(isoString: string | null): string {
  if (!isoString) return "—:——";
  const d = new Date(isoString);
  return d.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export default function AttendanceCard() {
  const { geo, request: requestGeo } = useGeolocation();
  const address = useReverseGeocode(geo.lat, geo.lng);
  const { today, loading: todayLoading } = useGetTodayAttendance();
  const { clockIn, clockOut } = useCreateAttendance();

  const revalidate = useRevalidateMutation();

  const [cameraOpen, setCameraOpen] = useState(false);
  const [capturedFile, setCapturedFile] = useState<File | null>(null);
  const [capturedPreview, setCapturedPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [pendingAction, setPendingAction] = useState<
    "check_in" | "check_out" | null
  >(null);

  const ui = toAttendanceUIState(today);
  const isReady = geo.status === "success" && capturedFile !== null;

  const handleCameraConfirm = (file: File, previewUrl: string) => {
    setCapturedFile(file);
    setCapturedPreview(previewUrl);
  };

  const handleRemovePhoto = () => {
    if (capturedPreview) URL.revokeObjectURL(capturedPreview);
    setCapturedFile(null);
    setCapturedPreview(null);
  };

  const handleSubmit = async (action: "check_in" | "check_out") => {
    if (!geo.locationString || !capturedFile) return;
    setPendingAction(action);
    setSubmitting(true);
    try {
      const payload = {
        location: geo.locationString,
        attendanceProofImage: capturedFile,
      };
      const res =
        action === "check_in"
          ? await clockIn(payload)
          : await clockOut(payload);

      // toast.success(
      //   res.data?.message ??
      //     (action === "check_in"
      //       ? "Check In berhasil!"
      //       : "Check Out berhasil!"),
      // );

      await Swal.fire({
        icon: "success",
        title:
          action === "check_in" ? "Check In Berhasil!" : "Check Out Berhasil!",
        text: res.data?.message ?? "",
        confirmButtonText: "OK",
      });

      handleRemovePhoto();
      setPendingAction(null);
      revalidate(/attendance/);
    } catch (err) {
      if (isAxiosError(err)) {
        // toast.error(err.response?.data?.error ?? "Gagal menyimpan absensi.");
        await Swal.fire({
          icon: "error",
          title: "Gagal!",
          text: err.response?.data?.error ?? "Gagal menyimpan absensi.",
          confirmButtonText: "OK",
        });
      } else {
        await Swal.fire({
          icon: "error",
          title: "Gagal!",
          text: "Terjadi kesalahan.",
          confirmButtonText: "OK",
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <CameraModal
        open={cameraOpen}
        onClose={() => setCameraOpen(false)}
        onConfirm={handleCameraConfirm}
      />

      <CardRoot>
        <CardHeader
          title="Absensi Hari Ini"
          subtitle="Pastikan lokasi dan foto sudah benar"
          action={
            <div className="flex items-center gap-1.5">
              {ui.hasCheckedIn && !ui.hasCheckedOut && (
                <span className="flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  Belum Check Out
                </span>
              )}
              {ui.hasCheckedOut && (
                <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                  <CheckCircle2 size={12} />
                  Selesai
                </span>
              )}
            </div>
          }
        />
        <CardBody className="flex flex-col gap-5">
          {todayLoading ? (
            <div className="flex gap-4">
              {[0, 1].map((i) => (
                <div
                  key={i}
                  className="flex-1 h-16 bg-slate-100 rounded-xl animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <TimeBlock
                label="Check In"
                time={formatTimeFromISO(ui.attendanceIn)}
                active={ui.hasCheckedIn}
                icon={<LogIn size={14} />}
                color="emerald"
              />
              <TimeBlock
                label="Check Out"
                time={formatTimeFromISO(ui.attendanceOut)}
                active={ui.hasCheckedOut}
                icon={<LogOut size={14} />}
                color="blue"
              />
            </div>
          )}

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <div
                  className={cm(
                    "mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                    geo.status === "success"
                      ? "bg-emerald-100"
                      : "bg-amber-100",
                  )}
                >
                  <MapPin
                    size={25}
                    className={
                      geo.status === "success"
                        ? "text-emerald-600"
                        : "text-amber-600"
                    }
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-ink mb-0.5">
                    Lokasi Anda
                  </p>
                  {geo.status === "loading" && (
                    <p className="text-xs text-ink-tertiary flex items-center gap-1.5">
                      <Loader2 size={11} className="animate-spin" /> Mendeteksi
                      lokasi...
                    </p>
                  )}
                  {geo.status === "success" && (
                    <>
                      <p
                        className="text-xs font-bold text-ink-tertiary truncate w-100"
                        title={address ? address : "Alamat tidak tersedia"}
                      >
                        {address}
                      </p>
                      <p className="text-[14px] text-ink-tertiary font-mono truncate">
                        {geo.lat?.toFixed(6)}, {geo.lng?.toFixed(6)}
                      </p>
                      {geo.accuracy && (
                        <p className="text-[11px] text-ink-tertiary mt-0.5">
                          Akurasi ±{Math.round(geo.accuracy)}m
                        </p>
                      )}
                    </>
                  )}
                  {(geo.status === "denied" ||
                    geo.status === "error" ||
                    geo.status === "unavailable") && (
                    <p className="text-xs text-red-500">{geo.errorMessage}</p>
                  )}
                  {geo.status === "idle" && (
                    <p className="text-xs text-ink-tertiary">
                      Menunggu izin lokasi...
                    </p>
                  )}
                </div>
              </div>
              {(geo.status === "denied" || geo.status === "error") && (
                <button
                  onClick={requestGeo}
                  className="shrink-0 p-1.5 rounded-lg hover:bg-slate-200 text-ink-tertiary hover:text-ink transition-colors"
                  title="Refresh lokasi"
                >
                  <RefreshCw size={14} />
                </button>
              )}
            </div>

            {ui.locationIn && (
              <div className="mt-2.5 pt-2.5 border-t border-slate-200">
                <p className="text-[11px] text-ink-tertiary">
                  Lokasi check-in:{" "}
                  <span className="font-mono">{ui.locationIn}</span>
                </p>
              </div>
            )}
          </div>

          <div>
            <p className="text-xs font-semibold text-ink mb-2.5">Foto Selfie</p>

            {ui.hasCheckedIn && ui.proofImageIn && !capturedPreview && (
              <div className="mb-2 rounded-xl overflow-hidden border border-emerald-200">
                <div className="bg-emerald-50 px-3 py-1.5">
                  <p className="text-[11px] text-emerald-600 font-medium">
                    Bukti Check In
                  </p>
                </div>
                <img
                  src={
                    ui.hasCheckedIn && ui.proofImageIn
                      ? getImageUrl(ui.proofImageIn)
                      : undefined
                  }
                  alt="Bukti check in"
                  className="w-full h-28 object-cover"
                />
              </div>
            )}

            {ui.hasCheckedOut && ui.proofImageOut && (
              <div className="mb-2 rounded-xl overflow-hidden border border-emerald-200">
                <div className="bg-emerald-50 px-3 py-1.5">
                  <p className="text-[11px] text-emerald-600 font-medium">
                    Bukti Check Out
                  </p>
                </div>
                <img
                  src={
                    ui.hasCheckedOut && ui.proofImageOut
                      ? getImageUrl(ui.proofImageOut)
                      : undefined
                  }
                  alt="Bukti check out"
                  className="w-full h-28 object-cover"
                />
              </div>
            )}

            {capturedPreview ? (
              <div className="relative rounded-xl overflow-hidden border border-slate-200">
                <img
                  src={capturedPreview}
                  alt="Selfie preview"
                  className="w-full h-40 object-cover"
                />
                <button
                  onClick={handleRemovePhoto}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
                >
                  <X size={13} />
                </button>
                <div className="absolute bottom-0 inset-x-0 bg-linear-to-t from-black/50 to-transparent px-3 py-2">
                  <p className="text-white text-xs font-medium">
                    Foto siap dikirim
                  </p>
                </div>
              </div>
            ) : (
              !(ui.hasCheckedIn && ui.hasCheckedOut) && (
                <button
                  onClick={() => setCameraOpen(true)}
                  className={cm(
                    "w-full rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 py-8 transition-all duration-150",
                    "hover:border-primary-400 hover:bg-primary-50/50",
                    "border-slate-200 bg-slate-50/50",
                  )}
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                    <Camera size={20} className="text-slate-400" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-ink-secondary">
                      Ambil Foto Selfie
                    </p>
                    <p className="text-xs text-ink-tertiary mt-0.5">
                      Klik untuk membuka kamera
                    </p>
                  </div>
                </button>
              )
            )}
          </div>

          {/* ── Warning ── */}
          {!isReady &&
            (geo.status !== "idle" || capturedFile !== null) &&
            !(ui.hasCheckedIn && ui.hasCheckedOut) && (
              <div className="flex items-start gap-2.5 rounded-xl bg-amber-50 border border-amber-200 p-3">
                <AlertTriangle
                  size={14}
                  className="text-amber-600 shrink-0 mt-0.5"
                />
                <div className="text-xs text-amber-700 space-y-0.5">
                  {geo.status !== "success" && (
                    <p>• Lokasi GPS belum terdeteksi.</p>
                  )}
                  {!capturedFile && <p>• Foto selfie belum diambil.</p>}
                </div>
              </div>
            )}

          {!ui.hasCheckedIn && (
            <Button
              variant="primary"
              className="w-full"
              disabled={!isReady || submitting}
              loading={submitting && pendingAction === "check_in"}
              leftIcon={<LogIn size={16} />}
              onClick={() => handleSubmit("check_in")}
            >
              Check In Sekarang
            </Button>
          )}

          {ui.hasCheckedIn && !ui.hasCheckedOut && (
            <Button
              variant="primary"
              className="w-full bg-blue-600 hover:bg-blue-700 focus:ring-blue-500/30"
              disabled={!isReady || submitting}
              loading={submitting && pendingAction === "check_out"}
              leftIcon={<LogOut size={16} />}
              onClick={() => handleSubmit("check_out")}
            >
              Check Out Sekarang
            </Button>
          )}

          {ui.hasCheckedOut && (
            <div className="flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-50 border border-emerald-200">
              <CheckCircle2 size={16} className="text-emerald-600" />
              <span className="text-sm font-medium text-emerald-700">
                Absensi hari ini selesai
              </span>
            </div>
          )}
        </CardBody>
      </CardRoot>
    </>
  );
}

interface TimeBlockProps {
  label: string;
  time: string;
  active: boolean;
  icon: React.ReactNode;
  color: "emerald" | "blue";
}

function TimeBlock({ label, time, active, icon, color }: TimeBlockProps) {
  const colorMap = {
    emerald: {
      active: "bg-emerald-50 border-emerald-200",
      icon: "bg-emerald-100 text-emerald-600",
      label: "text-emerald-600",
      time: "text-emerald-700",
    },
    blue: {
      active: "bg-blue-50 border-blue-200",
      icon: "bg-blue-100 text-blue-600",
      label: "text-blue-600",
      time: "text-blue-700",
    },
  };
  const c = colorMap[color];

  return (
    <div
      className={cm(
        "rounded-xl border p-3.5 flex items-center gap-3 transition-all",
        active ? c.active : "bg-slate-50 border-slate-200",
      )}
    >
      <div
        className={cm(
          "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
          active ? c.icon : "bg-slate-100 text-slate-400",
        )}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p
          className={cm(
            "text-xs font-medium",
            active ? c.label : "text-ink-tertiary",
          )}
        >
          {label}
        </p>
        <p
          className={cm(
            "text-sm font-bold tabular-nums",
            active ? c.time : "text-slate-300",
          )}
        >
          {active ? time : "—:——"}
        </p>
      </div>
    </div>
  );
}
