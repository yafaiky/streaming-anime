import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AnimeCard from "../components/AnimeCard";
import axios from "axios";
import { FaSearch, FaArrowLeft, FaSpinner } from "react-icons/fa";

const API_BASE_URL = import.meta.env.VITE_ANIME_API_BASE_URL;

const SearchPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
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
    <div className="min-h-screen bg-[#0a0a1a] pt-24 pb-16">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <button
            className="mb-6 flex items-center gap-2 px-5 py-2.5 bg-white/5 backdrop-blur-xl border border-white/10 text-white rounded-xl hover:bg-white/10 hover:border-indigo-500/30 transition-all duration-300 group"
            onClick={() => navigate("/")}
          >
            <FaArrowLeft className="text-sm group-hover:-translate-x-1 transition-transform duration-300" />
            Back to Home
          </button>

          <div className="flex items-center gap-4 mb-2">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30">
              <FaSearch className="text-white text-lg" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                Search Results
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                {query ? (
                  <>
                    Showing results for <span className="text-indigo-400 font-semibold">"{query}"</span>
                  </>
                ) : (
                  "Enter a search term to find anime"
                )}
              </p>
            </div>
          </div>

          {/* Results count */}
          {animeResults.length > 0 && (
            <div className="mt-4 flex items-center gap-2">
              <span className="bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 px-3 py-1 rounded-full text-sm font-semibold">
                {animeResults.length} results found
              </span>
            </div>
          )}
        </div>

        {/* Loading State - Initial */}
        {loading && page === 1 && (
          <div className="flex flex-col items-center justify-center py-20">
            <FaSpinner className="text-4xl text-indigo-500 animate-spin mb-4" />
            <p className="text-gray-400">Searching for anime...</p>
          </div>
        )}

        {/* Results Grid */}
        {animeResults.length > 0 && (
          <div>
            <div className="anime-grid">
              {animeResults.map((anime, index) => (
                <div
                  key={`${anime.mal_id}-${index}`}
                  className="animate-fade-in"
                  style={{ animationDelay: `${(index % 10) * 0.05}s` }}
                >
                  <AnimeCard anime={anime} />
                </div>
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="flex justify-center mt-12">
                <button
                  className="btn-secondary group"
                  onClick={() => setPage((prev) => prev + 1)}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <FaSpinner className="text-sm animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <FaSearch className="text-sm" />
                      Load More
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {/* No Results */}
        {!loading && animeResults.length === 0 && query && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6">
              <FaSearch className="text-4xl text-gray-600" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No results found</h3>
            <p className="text-gray-400 text-center max-w-md">
              We couldn't find any anime matching "<span className="text-indigo-400">{query}</span>". 
              Try searching with different keywords.
            </p>
            <button
              className="btn-primary mt-6"
              onClick={() => navigate("/")}
            >
              <FaArrowLeft className="text-sm" />
              Back to Home
            </button>
          </div>
        )}

        {/* Empty State */}
        {!query && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6">
              <FaSearch className="text-4xl text-gray-600" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Start searching</h3>
            <p className="text-gray-400 text-center max-w-md">
              Use the search bar above to find your favorite anime series and movies.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
