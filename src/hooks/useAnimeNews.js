import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_ANIME_API_BASE_URL;

/**
 * Custom hook untuk mengambil data berita anime dari Jikan API.
 * Endpoint: GET /anime/{id}/news?page={page}
 *
 * @param {string|number} id - Anime ID dari MyAnimeList
 * @returns {{
 *   news: Array,
 *   loading: boolean,
 *   loadingMore: boolean,
 *   error: string|null,
 *   hasNextPage: boolean,
 *   currentPage: number,
 *   loadMore: Function,
 *   retry: Function
 * }}
 *
 * Optimasi:
 * - useCallback pada fetchNews agar referensi fungsi stabil (mencegah unnecessary re-render)
 * - AbortController untuk batalkan request jika component unmount atau ID berubah (mencegah memory leak)
 * - `loadingMore` state terpisah dari `loading` agar UI Load More tidak bertabrakan dengan initial load
 * - Akumulasi data (append) untuk simulasi infinite scroll / Load More
 * - `useRef` untuk track controller terkini agar cleanup selalu up-to-date
 */
const useAnimeNews = (id) => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Ref untuk AbortController aktif agar cleanup selalu mencabut request terbaru
  const controllerRef = useRef(null);

  /**
   * Fetch news untuk halaman tertentu.
   * @param {number} page - nomor halaman yang akan di-fetch
   * @param {boolean} isLoadMore - apakah ini aksi "Load More" (append) atau fresh load (replace)
   */
  const fetchNews = useCallback(
    async (page, isLoadMore = false) => {
      if (!id) return;

      // Batalkan request sebelumnya jika masih berjalan
      if (controllerRef.current) {
        controllerRef.current.abort();
      }

      const controller = new AbortController();
      controllerRef.current = controller;

      // Gunakan state loading berbeda untuk initial vs load-more
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
        setError(null);
      }

      try {
        const response = await axios.get(`${API_BASE_URL}/anime/${id}/news`, {
          params: { page },
          signal: controller.signal,
        });

        const fetchedNews = response.data.data || [];
        const pagination = response.data.pagination || {};

        setNews((prev) => (isLoadMore ? [...prev, ...fetchedNews] : fetchedNews));
        setHasNextPage(pagination.has_next_page ?? false);
        setCurrentPage(page);
      } catch (err) {
        // Abaikan error dari request yang sengaja dibatalkan
        if (axios.isCancel(err) || err.name === "CanceledError") return;
        console.error("Error fetching anime news:", err);
        setError("Gagal memuat berita. Silakan coba lagi.");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [id]
  );

  // Initial fetch ketika `id` berubah — selalu mulai dari page 1
  useEffect(() => {
    setNews([]);
    setCurrentPage(1);
    setHasNextPage(false);
    fetchNews(1, false);

    // Cleanup: batalkan request in-flight saat unmount atau id berubah
    return () => {
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
    };
  }, [fetchNews]);

  /** Load halaman berikutnya, append ke list yang ada */
  const loadMore = useCallback(() => {
    if (!hasNextPage || loadingMore) return;
    fetchNews(currentPage + 1, true);
  }, [fetchNews, currentPage, hasNextPage, loadingMore]);

  /** Retry: ulangi fetch dari halaman 1 (dipakai saat error) */
  const retry = useCallback(() => {
    setNews([]);
    setCurrentPage(1);
    fetchNews(1, false);
  }, [fetchNews]);

  return { news, loading, loadingMore, error, hasNextPage, currentPage, loadMore, retry };
};

export default useAnimeNews;
