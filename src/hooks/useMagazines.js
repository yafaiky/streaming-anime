import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_ANIME_API_BASE_URL;

/**
 * Custom hook untuk mengambil daftar majalah/penerbit manga dari Jikan API.
 * Endpoint: GET /magazines?letter={letter}&q={q}&page={page}
 *
 * @param {object} filters - { letter: string, q: string }
 * @returns {{
 *   magazines: Array,
 *   loading: boolean,
 *   loadingMore: boolean,
 *   error: string|null,
 *   hasNextPage: boolean,
 *   totalCount: number,
 *   currentPage: number,
 *   loadMore: Function,
 *   retry: Function
 * }}
 *
 * Optimasi:
 * - AbortController (via useRef) → batalkan request lama saat filter berubah / unmount
 * - useCallback pada fetchMagazines → referensi stabil, tidak trigger re-render tidak perlu
 * - State `loadingMore` terpisah dari `loading` → UI tidak berkedip saat Load More
 * - Akumulasi data (append) saat Load More, replace saat filter berubah
 */
const useMagazines = ({ letter = "", q = "" } = {}) => {
  const [magazines, setMagazines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  // Ref untuk AbortController aktif agar cleanup selalu mencabut request terbaru
  const controllerRef = useRef(null);

  /**
   * Core fetch function.
   * @param {number} page - halaman yang di-fetch
   * @param {boolean} append - true = Load More (append), false = fresh load (replace)
   */
  const fetchMagazines = useCallback(
    async (page, append = false) => {
      // Batalkan request sebelumnya
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
      const controller = new AbortController();
      controllerRef.current = controller;

      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
        setError(null);
      }

      try {
        const params = { page };
        if (letter) params.letter = letter;
        if (q.trim()) params.q = q.trim();

        const response = await axios.get(`${API_BASE_URL}/magazines`, {
          params,
          signal: controller.signal,
        });

        const data = response.data.data || [];
        const pagination = response.data.pagination || {};

        setMagazines((prev) => (append ? [...prev, ...data] : data));
        setHasNextPage(pagination.has_next_page ?? false);
        setTotalCount(pagination.items?.total ?? 0);
        setCurrentPage(page);
      } catch (err) {
        if (axios.isCancel(err) || err.name === "CanceledError") return;
        console.error("Error fetching magazines:", err);
        setError("Gagal memuat data majalah. Silakan coba lagi.");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [letter, q]
  );

  // Re-fetch dari halaman 1 setiap kali filter (letter / q) berubah
  useEffect(() => {
    setMagazines([]);
    setCurrentPage(1);
    setHasNextPage(false);
    fetchMagazines(1, false);

    return () => {
      if (controllerRef.current) controllerRef.current.abort();
    };
  }, [fetchMagazines]);

  /** Append halaman berikutnya */
  const loadMore = useCallback(() => {
    if (!hasNextPage || loadingMore) return;
    fetchMagazines(currentPage + 1, true);
  }, [fetchMagazines, currentPage, hasNextPage, loadingMore]);

  /** Reset ke halaman 1 (tombol Retry saat error) */
  const retry = useCallback(() => {
    setMagazines([]);
    setCurrentPage(1);
    fetchMagazines(1, false);
  }, [fetchMagazines]);

  return {
    magazines,
    loading,
    loadingMore,
    error,
    hasNextPage,
    totalCount,
    currentPage,
    loadMore,
    retry,
  };
};

export default useMagazines;
