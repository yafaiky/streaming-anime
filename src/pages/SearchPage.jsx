import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import AnimeCard from "../components/AnimeCard";
import MangaCard from "../components/MangaCard";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_ANIME_API_BASE_URL;

const SearchPage = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q") || "";
  const [animeResults, setAnimeResults] = useState([]);
  const [mangaResults, setMangaResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) {
      setAnimeResults([]);
      setMangaResults([]);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      try {
        const [animeResponse, mangaResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/anime?q=${query}&limit=10`),
          axios.get(`${API_BASE_URL}/manga?q=${query}&limit=10`),
        ]);

        setAnimeResults(animeResponse.data.data);
        setMangaResults(mangaResponse.data.data);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
      setLoading(false);
    };

    fetchResults();
  }, [query]);

  return (
    <div className="p-6">
      {loading && <p className="text-gray-500 mt-4">Searching...</p>}

      {/* Anime Results */}
      {animeResults.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Anime Results</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {animeResults.map((anime) => (
              <Link key={anime.mal_id} to={`/anime/${anime.mal_id}`}>
                <AnimeCard anime={anime} />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Manga Results */}
      {mangaResults.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Manga Results</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {mangaResults.map((manga) => (
              <Link key={manga.mal_id} to={`/manga/${manga.mal_id}`}>
                <MangaCard manga={manga} />
              </Link>
            ))}
          </div>
        </div>
      )}

      {!loading && animeResults.length === 0 && mangaResults.length === 0 && (
        <p className="text-gray-500 text-center mt-4">No results found.</p>
      )}
    </div>
  );
};

export default SearchPage;
