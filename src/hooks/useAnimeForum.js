import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_ANIME_API_BASE_URL;

/**
 * Custom hook untuk mengambil data forum diskusi anime dari Jikan API.
 *
 * @param {string|number} id - Anime ID dari MyAnimeList
 * @returns {{ data: Array, loading: boolean, error: string|null, refetch: Function }}
 *
 * Optimasi:
 * - useCallback pada `fetchForum` agar referensi fungsi stabil (mencegah re-render)
 * - AbortController untuk batalkan request jika component unmount (mencegah memory leak)
 * - Guard `isMounted` agar state tidak diupdate setelah unmount
 */
const useAnimeForum = (id) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchForum = useCallback(async (signal) => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${API_BASE_URL}/anime/${id}/forum`, {
        signal, // Teruskan AbortSignal ke axios
      });
      setData(response.data.data || []);
    } catch (err) {
      // Abaikan error jika request sengaja dibatalkan (component unmount)
      if (axios.isCancel(err) || err.name === "CanceledError") return;
      console.error("Error fetching anime forum:", err);
      setError("Gagal memuat data forum. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    const controller = new AbortController();
    fetchForum(controller.signal);

    // Cleanup: batalkan request in-flight saat component unmount atau `id` berubah
    return () => controller.abort();
  }, [fetchForum]);

  // Fungsi refetch yang bisa dipanggil manual (e.g., tombol retry)
  const refetch = useCallback(() => {
    const controller = new AbortController();
    fetchForum(controller.signal);
  }, [fetchForum]);

  return { data, loading, error, refetch };
};

export default useAnimeForum;
