import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import AnimeCard from "../components/AnimeCard";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_ANIME_API_BASE_URL;

const SearchPage = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q") || "";

  const [animeResults, setAnimeResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    setAnimeResults([]);
    setPage(1);
    setHasMore(true);
  }, [query]);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;

      setLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/anime`, {
          params: {
            q: query,
            page: page,
            limit: 10,
          },
        });

        const newResults = response.data.data;

        if (newResults.length < 10) {
          setHasMore(false);
        }

        setAnimeResults((prev) =>
          page === 1 ? newResults : [...prev, ...newResults]
        );
      } catch (error) {
        console.error("Error fetching anime search results:", error);
        setHasMore(false);
      }

      setLoading(false);
    };

    fetchResults();
  }, [query, page]);

  return (
    <div className="container mx-auto px-4 py-4">
      {loading && page === 1 && (
        <p className="text-gray-500 mt-2">Searching...</p>
      )}

      {animeResults.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Anime Results</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {animeResults.map((anime) => (
              <AnimeCard key={anime.mal_id} anime={anime} />
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="text-center mt-6">
              <button
                className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 disabled:opacity-50"
                onClick={() => setPage((prev) => prev + 1)}
                disabled={loading}
              >
                {loading ? "Loading..." : "Load More"}
              </button>
            </div>
          )}
        </div>
      )}

      {!loading && animeResults.length === 0 && (
        <p className="text-gray-500 text-center mt-4">No results found.</p>
      )}
    </div>
  );
};

export default SearchPage;
