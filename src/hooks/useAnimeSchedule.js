import { useState, useCallback, useRef } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_ANIME_API_BASE_URL;

/**
 * Custom hook untuk mengambil jadwal anime dari Jikan API.
 * Endpoint : GET /schedules?filter={day}&sfw=true
 *
 * @returns {{
 *   schedule: Array,
 *   loading: boolean,
 *   error: string|null,
 *   activeDay: string,
 *   fetchSchedule: (day: string) => void
 * }}
 *
 * Optimasi:
 * ─ In-memory cache (useRef Map) → tab yang sudah di-fetch tidak di-request ulang ke API,
 *   cukup ambil dari cache; ini mencegah re-render & network request yang tidak perlu.
 * ─ AbortController (via useRef) → request sebelumnya dibatalkan saat tab berpindah cepat
 *   (mencegah race condition & memory leak).
 * ─ useCallback pada fetchSchedule → referensi fungsi stabil; aman di-pass sebagai prop
 *   atau dimasukkan ke dependency array useEffect di komponen lain.
 */
const useAnimeSchedule = () => {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeDay, setActiveDay] = useState("");

  // Cache: Map<day, Array<anime>> — persist selama komponen hidup
  const cacheRef = useRef(new Map());

  // Ref untuk AbortController aktif
  const controllerRef = useRef(null);

  const fetchSchedule = useCallback(async (day) => {
    if (!day) return;

    // ── Sudah di-cache? Tampilkan dari cache, tidak perlu fetch ulang ──
    if (cacheRef.current.has(day)) {
      setActiveDay(day);
      setSchedule(cacheRef.current.get(day));
      setError(null);
      return;
    }

    // ── Batalkan request sebelumnya yang masih berjalan ──
    if (controllerRef.current) {
      controllerRef.current.abort();
    }
    const controller = new AbortController();
    controllerRef.current = controller;

    setLoading(true);
    setError(null);
    setActiveDay(day);

    try {
      const response = await axios.get(`${API_BASE_URL}/schedules`, {
        params: { filter: day, sfw: true },
        signal: controller.signal,
      });

      const data = response.data.data || [];

      // Simpan ke cache
      cacheRef.current.set(day, data);
      setSchedule(data);
    } catch (err) {
      if (axios.isCancel(err) || err.name === "CanceledError") return;
      console.error("Error fetching anime schedule:", err);
      setError("Gagal memuat jadwal. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }, []); // tidak ada dependency → referensi stabil selamanya

  /** Invalidate cache untuk hari tertentu lalu re-fetch (tombol Retry) */
  const retry = useCallback(
    (day) => {
      if (day) cacheRef.current.delete(day);
      fetchSchedule(day);
    },
    [fetchSchedule]
  );

  return { schedule, loading, error, activeDay, fetchSchedule, retry };
};

export default useAnimeSchedule;
