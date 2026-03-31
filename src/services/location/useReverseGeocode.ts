import axiosInstance from "@/lib/axios";
import { useEffect, useState } from "react";

export function useReverseGeocode(
  latitude: number | null,
  longitude: number | null,
) {
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    if (!latitude || !longitude) {
      return;
    }

    const fetchAddress = async () => {
      try {
        const response = await axiosInstance().get(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
        );

        const data = response.data;
        if (data && data.display_name) {
          setAddress(data.display_name);
        }
      } catch {
        setAddress(null);
      }
    };

    fetchAddress();
  }, [latitude, longitude]);

  return address;
}
