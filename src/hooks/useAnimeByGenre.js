import { useState, useEffect, useRef, useCallback } from "react";

const BASE_URL = "https://api.jikan.moe/v4";

/**
 * Custom hook to fetch anime by genre with pagination support.
 * @param {string|number} genreId - The genre ID to fetch anime for.
 * @returns {{ anime, loading, loadingMore, error, hasNextPage, loadMore }}
 */
function useAnimeByGenre(genreId) {
  const [anime, setAnime] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);

  // Keep track of current genreId to reset state when it changes
  const prevGenreId = useRef(null);

  // Fetch a single page of results
  const fetchPage = useCallback(
    async (pageNum, isLoadMore = false) => {
      if (!genreId) return;

      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
        setError(null);
      }

      try {
        const url = `${BASE_URL}/anime?genres=${genreId}&sfw=true&page=${pageNum}&limit=24`;
        const res = await fetch(url);

        if (!res.ok) {
          // Handle 429 Too Many Requests gracefully
          if (res.status === 429) {
            throw new Error("Rate limit reached. Please wait a moment and try again.");
          }
          throw new Error(`Failed to fetch anime (HTTP ${res.status})`);
        }

        const json = await res.json();
        const results = json.data ?? [];
        const pagination = json.pagination ?? {};

        if (isLoadMore) {
          setAnime((prev) => [...prev, ...results]);
        } else {
          setAnime(results);
        }
        setHasNextPage(pagination.has_next_page ?? false);
      } catch (err) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [genreId]
  );

  // Reset and fetch page 1 whenever genreId changes
  useEffect(() => {
    if (!genreId) return;

    if (prevGenreId.current !== genreId) {
      prevGenreId.current = genreId;
      setAnime([]);
      setPage(1);
      setHasNextPage(false);
      setError(null);
      fetchPage(1, false);
    }
  }, [genreId, fetchPage]);

  // Called by the user to load more results
  const loadMore = useCallback(() => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPage(nextPage, true);
  }, [page, fetchPage]);

  return { anime, loading, loadingMore, error, hasNextPage, loadMore };
}

export default useAnimeByGenre;
