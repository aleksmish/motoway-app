import { useLocationStore } from "@/store/useLocationStore";
import { useEffect, useState } from "react";

export interface WeatherInfo {
  temp: number;
  icon: string;
  roadCondition: string;
  isWetOrCold: boolean;
}

export const useWeather = () => {
  const { coords, requestAndFetchLocation } = useLocationStore();
  const [weather, setWeather] = useState<WeatherInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!coords) {
      requestAndFetchLocation().finally(() => setLoading(false));
    }
  }, [coords, requestAndFetchLocation]);

  useEffect(() => {
    if (!coords) return;
    let isMounted = true;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const fetchWeather = async () => {
      try {
        setLoading(true);
        const url = `https://wttr.in/{coords.latitude},${coords.longitude}?format=4`;
        const res = await fetch(url, {
          signal: controller.signal,
          headers: { "User-Agent": "MotoWayStudentApp/1.0" },
        });

        const text = await res.text();

        const tempMatch = text.match(/([+-]?\d+)\s*°C/);
        const temp = tempMatch ? Number(tempMatch) : 15;

        const isSnow = /[❄️🌨️]/.test(text);
        const isRain = /[🌧️🌦️⛈️🌩️💧]/.test(text);
        const isFog = /[🌫️]/.test(text);

        let icon = "☀️";
        let roadCondition = "Сухой асфальт";
        let isWetOrCold = false;

        if (isSnow || temp <= 0) {
          icon = isSnow ? "❄️" : "🥶";
          roadCondition = "Скользко / Холодно";
          isWetOrCold = true;
        } else if (isRain) {
          icon = "🌧️";
          roadCondition = "Мокрый асфальт";
          isWetOrCold = true;
        } else if (isFog) {
          icon = "🌫️";
          roadCondition = "Туман / Влажно";
          isWetOrCold = true;
        } else if (/[⛅☁️🌥️]/.test(text)) {
          icon = "⛅";
        }

        if (isMounted) {
          setWeather({ temp, icon, roadCondition, isWetOrCold });
        }
      } catch (err) {
        console.log("Ошибка загрузки погоды:", err);
      } finally {
        clearTimeout(timeoutId);
        if (isMounted) setLoading(false);
      }
    };

    fetchWeather();
    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [coords?.latitude, coords?.longitude]);

  return { weather, loading };
};
