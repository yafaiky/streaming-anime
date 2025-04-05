import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_ANIME_API_BASE_URL;

const AnimeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [anime, setAnime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/anime/${id}`)
      .then((response) => {
        setAnime(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching anime details:", error);
        setError("Failed to load anime details.");
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p className="text-center text-gray-400">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="px-4 md:px-8 lg:px-16 py-4">
      <div className="max-w-screen-xl mx-auto">
        {/* Tombol Back to Home */}
        <button
          className="mb-4 px-4 py-2 bg-gray-900 text-white rounded hover:bg-blue-950"
          onClick={() => navigate("/")}
        >
          ← Back to Home
        </button>

        {/* Detail Anime */}
        <div className="anime-details flex flex-col md:flex-row items-start gap-6">
          {/* Gambar Cover */}
          <img
            src={anime.images?.jpg.image_url}
            alt={anime.title}
            className="w-60 rounded-lg shadow-lg"
          />

          <div className="anime-content flex-1">
            {/* Judul dan Informasi */}
            <h1 className="text-3xl font-bold">{anime.title}</h1>
            <p className="text-gray-500 italic">
              {anime.title_japanese || "No Japanese Title"}
            </p>
            <p><strong>Type:</strong> {anime.type || "Unknown"}</p>
            <p><strong>Status:</strong> {anime.status || "Unknown"}</p>
            <p><strong>Episodes:</strong> {anime.episodes || "Unknown"}</p>
            <p><strong>Aired:</strong> {anime.aired?.string || "Unknown"}</p>
            <p><strong>Score:</strong> {anime.score || "N/A"} ⭐</p>
            <p><strong>Rank:</strong> #{anime.rank || "N/A"}</p>
            <p><strong>Popularity:</strong> #{anime.popularity || "N/A"}</p>
            <p><strong>Favorites:</strong> {anime.favorites || 0} ❤️</p>

            {/* Studios */}
            <p>
              <strong>Studios:</strong>{" "}
              {anime.studios.length > 0
                ? anime.studios.map((s) => s.name).join(", ")
                : "Unknown"}
            </p>

            {/* Producers */}
            <p>
              <strong>Producers:</strong>{" "}
              {anime.producers.length > 0
                ? anime.producers.map((p) => p.name).join(", ")
                : "Unknown"}
            </p>

            {/* Genre */}
            <p><strong>Genres:</strong></p>
            <div className="flex flex-wrap gap-2 mt-1">
              {anime.genres.map((genre) => (
                <span
                  key={genre.mal_id}
                  className="bg-gray-800 text-white px-2 py-1 rounded-full text-sm"
                >
                  {genre.name}
                </span>
              ))}
            </div>

            {/* Themes */}
            {anime.themes.length > 0 && (
              <>
                <p><strong>Themes:</strong></p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {anime.themes.map((theme) => (
                    <span
                      key={theme.mal_id}
                      className="bg-gray-600 text-white px-2 py-1 rounded-full text-sm"
                    >
                      {theme.name}
                    </span>
                  ))}
                </div>
              </>
            )}

            {/* Demographic */}
            {anime.demographics.length > 0 && (
              <>
                <p><strong>Demographics:</strong></p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {anime.demographics.map((demo) => (
                    <span
                      key={demo.mal_id}
                      className="bg-gray-700 text-white px-2 py-1 rounded-full text-sm"
                    >
                      {demo.name}
                    </span>
                  ))}
                </div>
              </>
            )}

            {/* External Link */}
            <p className="mt-2">
              <strong>More Info:</strong>
              <a
                href={anime.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline ml-2"
              >
                View on MyAnimeList
              </a>
            </p>

            {/* Sinopsis */}
            <p className="mt-4">
              <strong>Synopsis:</strong> {anime.synopsis || "No synopsis available."}
            </p>
          </div>
        </div>

        {/* Trailer Section */}
        {anime.trailer?.embed_url && (
          <div className="mt-6">
            <h2 className="text-2xl font-semibold mb-2">Trailer</h2>
            <div className="relative w-full h-64 md:h-96">
              <iframe
                className="w-full h-full rounded-lg shadow-lg"
                src={anime.trailer.embed_url}
                title={`${anime.title} Trailer`}
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnimeDetails;
