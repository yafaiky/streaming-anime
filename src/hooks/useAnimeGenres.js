import { useState, useEffect } from "react";

const BASE_URL = "https://api.jikan.moe/v4";
const CACHE = {}; // In-memory cache to avoid redundant requests

/**
 * Fetches a single endpoint and caches the result.
 */
async function fetchWithCache(key, url) {
  if (CACHE[key]) return CACHE[key];
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  CACHE[key] = json.data ?? [];
  return CACHE[key];
}

/**
 * Custom hook to fetch all anime genres, themes, and demographics
 * from the Jikan API. Results are cached in memory.
 */
function useAnimeGenres() {
  const [genres, setGenres] = useState([]);
  const [themes, setThemes] = useState([]);
  const [demographics, setDemographics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [g, t, d] = await Promise.all([
          fetchWithCache("genres", `${BASE_URL}/genres/anime?filter=genres`),
          fetchWithCache("themes", `${BASE_URL}/genres/anime?filter=themes`),
          fetchWithCache("demographics", `${BASE_URL}/genres/anime?filter=demographics`),
        ]);
        if (!cancelled) {
          setGenres(g);
          setThemes(t);
          setDemographics(d);
        }
      } catch (err) {
        if (!cancelled) setError(err.message ?? "Failed to load genres.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  return { genres, themes, demographics, loading, error };
}

export default useAnimeGenres;
