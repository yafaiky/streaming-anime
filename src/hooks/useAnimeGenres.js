import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_ANIME_API_BASE_URL;

/**
 * Custom hook untuk mengambil semua genre, tema, dan demografis anime
 * dari Jikan API.
 *
 * Endpoint : GET /genres/anime
 * Parameter: filter = "genres" | "explicit_genres" | "themes" | "demographics"
 *
 * Strategi:
 * ─ Fetch 3 grup sekaligus secara paralel (Promise.allSettled) agar satu
 *   fetch yang gagal tidak menggagalkan seluruh halaman.
 * ─ AbortController (via useRef) mencegah memory leak saat unmount.
 * ─ Data di-cache dalam useRef Map → re-mount komponen tidak re-fetch.
 * ─ useCallback pada fetchAll → referensi stabil, aman di dependency array.
 *
 * @returns {{
 *   genres: Array,
 *   themes: Array,
 *   demographics: Array,
 *   loading: boolean,
 *   error: string|null,
 *   retry: Function
 * }}
 */

const FILTERS = {
  genres:       "genres",
  themes:       "themes",
  demographics: "demographics",
};

const useAnimeGenres = () => {
  const [genres,       setGenres]       = useState([]);
  const [themes,       setThemes]       = useState([]);
  const [demographics, setDemographics] = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);

  const controllerRef = useRef(null);
  // Cache: Map<filter, Array>
  const cacheRef = useRef(new Map());

  const fetchAll = useCallback(async () => {
    // Cek apakah semua grup sudah di-cache
    const allCached = Object.values(FILTERS).every((f) => cacheRef.current.has(f));
    if (allCached) {
      setGenres(cacheRef.current.get(FILTERS.genres));
      setThemes(cacheRef.current.get(FILTERS.themes));
      setDemographics(cacheRef.current.get(FILTERS.demographics));
      setLoading(false);
      return;
    }

    if (controllerRef.current) controllerRef.current.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      // Fetch 3 kategori paralel — allSettled agar satu gagal tidak blokir semua
      const results = await Promise.allSettled(
        Object.values(FILTERS).map((filter) =>
          axios.get(`${API_BASE_URL}/genres/anime`, {
            params: { filter },
            signal: controller.signal,
          })
        )
      );

      const [genresRes, themesRes, demographicsRes] = results;

      const toData = (result) =>
        result.status === "fulfilled" ? result.value.data.data ?? [] : [];

      const g = toData(genresRes);
      const t = toData(themesRes);
      const d = toData(demographicsRes);

      // Simpan ke cache
      cacheRef.current.set(FILTERS.genres,       g);
      cacheRef.current.set(FILTERS.themes,        t);
      cacheRef.current.set(FILTERS.demographics,  d);

      setGenres(g);
      setThemes(t);
      setDemographics(d);

      // Error hanya jika SEMUA fetch gagal
      const allFailed = results.every((r) => r.status === "rejected");
      if (allFailed) {
        const firstCancelled = results.find(
          (r) => axios.isCancel(r.reason) || r.reason?.name === "CanceledError"
        );
        if (!firstCancelled) setError("Gagal memuat data genre. Silakan coba lagi.");
      }
    } catch (err) {
      if (axios.isCancel(err) || err.name === "CanceledError") return;
      setError("Gagal memuat data genre. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
    return () => {
      if (controllerRef.current) controllerRef.current.abort();
    };
  }, [fetchAll]);

  const retry = useCallback(() => {
    // Invalidate cache lalu re-fetch
    cacheRef.current.clear();
    fetchAll();
  }, [fetchAll]);

  return { genres, themes, demographics, loading, error, retry };
};

export default useAnimeGenres;
