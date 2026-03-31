import { useState, useEffect, useCallback } from "react";

export type GeoStatus =
  | "idle"
  | "loading"
  | "success"
  | "denied"
  | "unavailable"
  | "error";

export interface GeoState {
  status: GeoStatus;
  lat: number | null;
  lng: number | null;
  accuracy: number | null;
  errorMessage: string | null;
  locationString: string | null; // "lat,lng" siap kirim ke backend
}

export default function useGeolocation() {
  const [geo, setGeo] = useState<GeoState>({
    status: "idle",
    lat: null,
    lng: null,
    accuracy: null,
    errorMessage: null,
    locationString: null,
  });

  const request = useCallback(() => {
    if (!navigator.geolocation) {
      setGeo((p) => ({
        ...p,
        status: "unavailable",
        errorMessage: "Browser tidak mendukung geolokasi.",
      }));
      return;
    }

    setGeo((p) => ({ ...p, status: "loading", errorMessage: null }));

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        setGeo({
          status: "success",
          lat: latitude,
          lng: longitude,
          accuracy,
          errorMessage: null,
          locationString: `${latitude},${longitude}`,
        });
      },
      (err) => {
        let msg = "Gagal mendapatkan lokasi.";
        if (err.code === err.PERMISSION_DENIED)
          msg = "Izin lokasi ditolak. Aktifkan izin lokasi di browser Anda.";
        else if (err.code === err.POSITION_UNAVAILABLE)
          msg = "Informasi lokasi tidak tersedia.";
        else if (err.code === err.TIMEOUT) msg = "Permintaan lokasi timeout.";

        setGeo((p) => ({
          ...p,
          status: err.code === err.PERMISSION_DENIED ? "denied" : "error",
          errorMessage: msg,
        }));
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );
  }, []);

  // Auto-request saat mount
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    request();
  }, [request]);

  return { geo, request };
}
