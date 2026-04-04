import { useState, useCallback, useRef } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_ANIME_API_BASE_URL;

/**
 * Custom hook untuk mengambil daftar anime berdasarkan genre ID.
 * Endpoint: GET /anime?genres={id}&sfw=true&page={page}&order_by=score&sort=desc
 *
 * @param {string|number} genreId - ID genre dari MyAnimeList
 * @returns {{
 *   animeList: Array,
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
 * ─ AbortController (useRef) → batalkan request saat genreId berubah/unmount
 * ─ useCallback + [] dependency → fetchAnime tidak pernah re-create (stabil)
 * ─ loadingMore terpisah dari loading → skeleton hanya muncul di initial load;
 *   Load More hanya ganti tombol jadi spinner kecil
 * ─ Hasil di-append (bukan replace) saat Load More
 */
const useAnimeByGenre = (genreId) => {
  const [animeList,   setAnimeList]   = useState([]);
  const [loading,     setLoading]     = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error,       setError]       = useState(null);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [totalCount,  setTotalCount]  = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const controllerRef = useRef(null);

  /**
   * Fetch satu halaman anime.
   * @param {number}  page   - halaman yang di-fetch
   * @param {boolean} append - true = Load More (append), false = fresh fetch (replace)
   */
  const fetchAnime = useCallback(
    async (page, append = false) => {
      if (!genreId) return;

      // Batalkan request sebelumnya
      if (controllerRef.current) controllerRef.current.abort();
      const controller = new AbortController();
      controllerRef.current = controller;

      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
        setError(null);
      }

      try {
        const response = await axios.get(`${API_BASE_URL}/anime`, {
          params: {
            genres:   genreId,
            sfw:      true,
            page,
            order_by: "score",
            sort:     "desc",
          },
          signal: controller.signal,
        });

        const data       = response.data.data       ?? [];
        const pagination = response.data.pagination ?? {};

        setAnimeList((prev) => (append ? [...prev, ...data] : data));
        setHasNextPage(pagination.has_next_page ?? false);
        setTotalCount(pagination.items?.total   ?? 0);
        setCurrentPage(page);
      } catch (err) {
        if (axios.isCancel(err) || err.name === "CanceledError") return;
        console.error("Error fetching anime by genre:", err);
        setError("Gagal memuat daftar anime. Silakan coba lagi.");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [genreId]
  );

  /** Append halaman berikutnya */
  const loadMore = useCallback(() => {
    if (!hasNextPage || loadingMore) return;
    fetchAnime(currentPage + 1, true);
  }, [fetchAnime, currentPage, hasNextPage, loadingMore]);

  /** Reset ke page 1 – invalidate data saat error */
  const retry = useCallback(() => {
    setAnimeList([]);
    setCurrentPage(1);
    fetchAnime(1, false);
  }, [fetchAnime]);

  return {
    animeList,
    loading,
    loadingMore,
    error,
    hasNextPage,
    totalCount,
    currentPage,
    fetchAnime,
    loadMore,
    retry,
  };
};

export default useAnimeByGenre;
