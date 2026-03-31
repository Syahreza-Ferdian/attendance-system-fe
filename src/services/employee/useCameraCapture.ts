import { useState, useRef, useCallback, useEffect } from "react";

export type CameraStatus = "idle" | "opening" | "ready" | "captured" | "error";

export interface CameraState {
  status: CameraStatus;
  errorMessage: string | null;
  capturedBlob: Blob | null;
  capturedFile: File | null;
  previewUrl: string | null;
}

export default function useCameraCapture() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [state, setState] = useState<CameraState>({
    status: "idle",
    errorMessage: null,
    capturedBlob: null,
    capturedFile: null,
    previewUrl: null,
  });

  // Bersihkan stream saat unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openCamera = useCallback(async () => {
    setState((p) => ({ ...p, status: "opening", errorMessage: null }));
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
        audio: false,
      });
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setState((p) => ({ ...p, status: "ready" }));
    } catch (err: unknown) {
      const msg =
        err instanceof Error && err.name === "NotAllowedError"
          ? "Izin kamera ditolak. Aktifkan izin kamera di browser."
          : "Tidak dapat membuka kamera.";
      setState((p) => ({ ...p, status: "error", errorMessage: msg }));
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  }, []);

  const capture = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Mirror horizontal untuk selfie
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const file = new File([blob], `selfie-${Date.now()}.jpg`, {
          type: "image/jpeg",
        });
        const url = URL.createObjectURL(blob);
        setState((p) => ({
          ...p,
          status: "captured",
          capturedBlob: blob,
          capturedFile: file,
          previewUrl: url,
        }));
        stopCamera();
      },
      "image/jpeg",
      0.88,
    );
  }, [stopCamera]);

  const retake = useCallback(() => {
    if (state.previewUrl) URL.revokeObjectURL(state.previewUrl);
    setState({
      status: "idle",
      errorMessage: null,
      capturedBlob: null,
      capturedFile: null,
      previewUrl: null,
    });
  }, [state.previewUrl]);

  return {
    state,
    videoRef,
    canvasRef,
    openCamera,
    stopCamera,
    capture,
    retake,
  };
}
