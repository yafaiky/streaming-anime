import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_ANIME_API_BASE_URL;

const MangaDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [manga, setManga] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/manga/${id}`)
      .then((response) => {
        setManga(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching manga details:", error);
        setError("Failed to load manga details.");
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p className="text-center text-gray-400">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="p-4">
      {/* Tombol Back to Home */}
      <button
        className="mb-4 px-4 py-2 bg-gray-900 text-white rounded hover:bg-blue-950"
        onClick={() => navigate("/")}
      >
        ← Back to Home
      </button>

      {/* Detail Manga */}
      <div className="manga-details flex flex-col md:flex-row items-start gap-6">
        {/* Gambar Cover */}
        <img
          src={manga.images?.jpg.image_url}
          alt={manga.title}
          className="w-60 rounded-lg shadow-lg"
        />

        <div className="manga-content flex-1">
          {/* Judul dan Informasi */}
          <h1 className="text-3xl font-bold">{manga.title}</h1>
          <p className="text-gray-500 italic">{manga.title_japanese || "No Japanese Title"}</p>
          <p><strong>Type:</strong> {manga.type || "Unknown"}</p>
          <p><strong>Status:</strong> {manga.status || "Unknown"}</p>
          <p><strong>Chapters:</strong> {manga.chapters || "Unknown"}</p>
          <p><strong>Volumes:</strong> {manga.volumes || "Unknown"}</p>
          <p><strong>Published:</strong> {manga.published.string || "Unknown"}</p>
          <p><strong>Score:</strong> {manga.score || "N/A"} ⭐</p>
          <p><strong>Rank:</strong> #{manga.rank || "N/A"}</p>
          <p><strong>Popularity:</strong> #{manga.popularity || "N/A"}</p>
          <p><strong>Favorites:</strong> {manga.favorites || 0} ❤️</p>

          {/* Authors */}
          <p>
            <strong>Authors:</strong> 
            {manga.authors.length > 0
              ? manga.authors.map((a) => a.name).join(", ")
              : "Unknown"}
          </p>

          {/* Serialization */}
          <p>
            <strong>Serialization:</strong> 
            {manga.serializations.length > 0
              ? manga.serializations.map((s) => s.name).join(", ")
              : "Unknown"}
          </p>

          {/* Genre */}
          <p><strong>Genres:</strong></p>
          <div className="flex flex-wrap gap-2 mt-1">
            {manga.genres.map((genre) => (
              <span
                key={genre.mal_id}
                className="bg-gray-800 text-white px-2 py-1 rounded-full text-sm"
              >
                {genre.name}
              </span>
            ))}
          </div>

          {/* Themes */}
          {manga.themes.length > 0 && (
            <>
              <p><strong>Themes:</strong></p>
              <div className="flex flex-wrap gap-2 mt-1">
                {manga.themes.map((theme) => (
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
          {manga.demographics.length > 0 && (
            <>
              <p><strong>Demographics:</strong></p>
              <div className="flex flex-wrap gap-2 mt-1">
                {manga.demographics.map((demo) => (
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
              href={manga.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline ml-2"
            >
              View on MyAnimeList
            </a>
          </p>

          {/* Sinopsis */}
          <p className="mt-4"><strong>Synopsis:</strong> {manga.synopsis || "No synopsis available."}</p>
        </div>
      </div>
    </div>
  );
};

export default MangaDetails;
