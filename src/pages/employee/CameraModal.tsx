import { useEffect } from "react";
import { Camera, X, RotateCcw, Check, Loader2, VideoOff } from "lucide-react";
import { cm } from "@lib/utils";
import useCameraCapture from "@/services/employee/useCameraCapture";
import Button from "@/components/Button";

interface CameraModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (file: File, previewUrl: string) => void;
}

export default function CameraModal({
  open,
  onClose,
  onConfirm,
}: CameraModalProps) {
  const {
    state,
    videoRef,
    canvasRef,
    openCamera,
    stopCamera,
    capture,
    retake,
  } = useCameraCapture();

  useEffect(() => {
    if (open) {
      openCamera();
    } else {
      stopCamera();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleClose = () => {
    stopCamera();
    retake();
    onClose();
  };

  const handleConfirm = () => {
    if (state.capturedFile && state.previewUrl) {
      onConfirm(state.capturedFile, state.previewUrl);
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div className="bg-white rounded-2xl shadow-card-lg w-full max-w-md overflow-hidden animate-slide-in-up">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center">
              <Camera size={16} className="text-primary-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-ink">Foto Selfie</p>
              <p className="text-xs text-ink-tertiary">Bukti kehadiran Anda</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="relative bg-slate-900 aspect-4/3 w-full overflow-hidden">
          <canvas ref={canvasRef} className="hidden" />

          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={cm(
              "w-full h-full object-cover",
              "scale-x-[-1]",
              state.status === "captured" && "hidden",
            )}
          />

          {state.status === "captured" && state.previewUrl && (
            <img
              src={state.previewUrl}
              alt="Selfie preview"
              className="w-full h-full object-cover"
            />
          )}

          {state.status === "opening" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-900">
              <Loader2 size={28} className="text-primary-400 animate-spin" />
              <p className="text-sm text-slate-400">Membuka kamera...</p>
            </div>
          )}

          {state.status === "error" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-900 px-6 text-center">
              <VideoOff size={32} className="text-red-400" />
              <p className="text-sm text-red-400 font-medium">
                {state.errorMessage}
              </p>
              <Button
                size="sm"
                variant="outline"
                onClick={openCamera}
                className="mt-1 border-white/20 text-white hover:bg-white/10"
              >
                Coba Lagi
              </Button>
            </div>
          )}

          {state.status === "ready" && (
            <div className="absolute inset-0 pointer-events-none">
              {/* corner */}
              <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-white/60 rounded-tl-lg" />
              <div className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-white/60 rounded-tr-lg" />
              <div className="absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 border-white/60 rounded-bl-lg" />
              <div className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-white/60 rounded-br-lg" />

              <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/40 rounded-full px-2.5 py-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                <span className="text-white text-[10px] font-medium tracking-wide">
                  LIVE
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="px-5 py-4 flex items-center justify-between gap-3 bg-slate-50 border-t border-slate-100">
          {state.status === "captured" ? (
            <>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<RotateCcw size={14} />}
                onClick={retake}
                className="flex-1"
              >
                Ulangi
              </Button>
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Check size={14} />}
                onClick={handleConfirm}
                className="flex-1"
              >
                Gunakan Foto
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="flex-1"
              >
                Batal
              </Button>
              <button
                onClick={capture}
                disabled={state.status !== "ready"}
                className={cm(
                  "shrink-0 w-14 h-14 rounded-full border-4 border-white shadow-lg transition-all duration-150",
                  "flex items-center justify-center",
                  state.status === "ready"
                    ? "bg-primary-600 hover:bg-primary-700 active:scale-95 cursor-pointer"
                    : "bg-slate-300 cursor-not-allowed",
                )}
                aria-label="Ambil foto"
              >
                <Camera size={22} className="text-white" />
              </button>
              <div className="flex-1" />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
