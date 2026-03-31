import { useState, useEffect } from "react";

interface LiveClock {
  hours: string;
  minutes: string;
  seconds: string;
  fullTime: string; // "07:30:45"
  dateShort: string; // "Senin, 31 Mar 2025"
  dateLong: string; // "Senin, 31 Maret 2025"
  greeting: string; // "Selamat Pagi"
  isWorkHour: boolean; // 07:00 – 17:00
}

export default function useLiveClock(): LiveClock {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");

  const hours = pad(now.getHours());
  const minutes = pad(now.getMinutes());
  const seconds = pad(now.getSeconds());

  const h = now.getHours();
  let greeting = "Selamat Malam";
  if (h >= 4 && h < 11) greeting = "Selamat Pagi";
  else if (h >= 11 && h < 15) greeting = "Selamat Siang";
  else if (h >= 15 && h < 19) greeting = "Selamat Sore";

  const dateShort = now.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const dateLong = now.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return {
    hours,
    minutes,
    seconds,
    fullTime: `${hours}:${minutes}:${seconds}`,
    dateShort,
    dateLong,
    greeting,
    isWorkHour: h >= 7 && h < 17,
  };
}
