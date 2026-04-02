import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { FaArrowLeft, FaStar, FaHeart, FaPlay, FaExternalLinkAlt, FaCalendar, FaTv, FaFilm } from "react-icons/fa";

const API_BASE_URL = import.meta.env.VITE_ANIME_API_BASE_URL;

const AnimeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [anime, setAnime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a1a]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Loading anime details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a1a]">
        <div className="text-center">
          <p className="text-red-400 bg-red-500/10 px-6 py-3 rounded-xl inline-block border border-red-500/20 mb-4">
            {error}
          </p>
          <button
            className="btn-primary"
            onClick={() => navigate("/")}
          >
            <FaArrowLeft /> Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      {/* Hero Banner */}
      <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url})`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a1a] via-[#0a0a1a]/80 to-[#0a0a1a]/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a1a] via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-40 pb-16">
        {/* Back Button */}
        <button
          className="mb-6 flex items-center gap-2 px-5 py-2.5 bg-white/5 backdrop-blur-xl border border-white/10 text-white rounded-xl hover:bg-white/10 hover:border-indigo-500/30 transition-all duration-300 group"
          onClick={() => navigate("/")}
        >
          <FaArrowLeft className="text-sm group-hover:-translate-x-1 transition-transform duration-300" />
          Back to Home
        </button>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Cover Image */}
          <div className="flex-shrink-0">
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-br from-indigo-500/30 to-purple-500/30 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <img
                src={anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url}
                alt={anime.title}
                className="relative w-64 md:w-72 rounded-2xl shadow-2xl shadow-black/50 border border-white/10"
              />
              {/* Score badge */}
              {anime.score && (
                <div className="absolute -top-3 -right-3 bg-gradient-to-br from-yellow-500 to-orange-600 text-white px-4 py-2 rounded-xl font-bold shadow-lg flex items-center gap-2">
                  <FaStar className="text-sm" />
                  {anime.score}
                </div>
              )}
            </div>
          </div>

          {/* Details Content */}
          <div className="flex-1 min-w-0">
            {/* Title Section */}
            <div className="mb-6">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 leading-tight">
                {anime.title}
              </h1>
              {anime.title_japanese && (
                <p className="text-gray-400 text-lg italic">
                  {anime.title_japanese}
                </p>
              )}
            </div>

            {/* Quick Stats */}
            <div className="flex flex-wrap gap-3 mb-8">
              {anime.type && (
                <span className="flex items-center gap-2 bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 px-4 py-2 rounded-xl text-sm font-semibold">
                  <FaFilm className="text-xs" />
                  {anime.type}
                </span>
              )}
              {anime.status && (
                <span className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border ${
                  anime.status === "Currently Airing"
                    ? "bg-green-500/15 border-green-500/30 text-green-400"
                    : "bg-gray-500/15 border-gray-500/30 text-gray-400"
                }`}>
                  <FaTv className="text-xs" />
                  {anime.status}
                </span>
              )}
              {anime.episodes && (
                <span className="flex items-center gap-2 bg-purple-500/15 border border-purple-500/30 text-purple-300 px-4 py-2 rounded-xl text-sm font-semibold">
                  {anime.episodes} Episodes
                </span>
              )}
              {anime.rating && (
                <span className="bg-orange-500/15 border border-orange-500/30 text-orange-300 px-4 py-2 rounded-xl text-sm font-semibold">
                  {anime.rating}
                </span>
              )}
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: "Score", value: anime.score || "N/A", icon: FaStar, color: "text-yellow-400" },
                { label: "Rank", value: `#${anime.rank || "N/A"}`, icon: null, color: "text-indigo-400" },
                { label: "Popularity", value: `#${anime.popularity || "N/A"}`, icon: null, color: "text-purple-400" },
                { label: "Favorites", value: anime.favorites?.toLocaleString() || "0", icon: FaHeart, color: "text-red-400" },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:border-indigo-500/30 transition-all duration-300"
                >
                  <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">{stat.label}</p>
                  <p className={`text-lg font-bold ${stat.color} flex items-center gap-1.5`}>
                    {stat.icon && <stat.icon className="text-sm" />}
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Genres */}
            {anime.genres && anime.genres.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Genres</h3>
                <div className="flex flex-wrap gap-2">
                  {anime.genres.map((genre) => (
                    <span
                      key={genre.mal_id}
                      className="badge badge-primary"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Themes */}
            {anime.themes && anime.themes.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Themes</h3>
                <div className="flex flex-wrap gap-2">
                  {anime.themes.map((theme) => (
                    <span
                      key={theme.mal_id}
                      className="badge badge-secondary"
                    >
                      {theme.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Demographics */}
            {anime.demographics && anime.demographics.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Demographics</h3>
                <div className="flex flex-wrap gap-2">
                  {anime.demographics.map((demo) => (
                    <span
                      key={demo.mal_id}
                      className="badge bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                    >
                      {demo.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {anime.studios && anime.studios.length > 0 && (
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Studios</p>
                  <p className="text-white font-medium">
                    {anime.studios.map((s) => s.name).join(", ")}
                  </p>
                </div>
              )}
              {anime.producers && anime.producers.length > 0 && (
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Producers</p>
                  <p className="text-white font-medium">
                    {anime.producers.slice(0, 3).map((p) => p.name).join(", ")}
                  </p>
                </div>
              )}
              {anime.aired?.string && (
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <p className="text-gray-500 text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <FaCalendar className="text-xs" /> Aired
                  </p>
                  <p className="text-white font-medium">{anime.aired.string}</p>
                </div>
              )}
              {anime.duration && (
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Duration</p>
                  <p className="text-white font-medium">{anime.duration}</p>
                </div>
              )}
            </div>

            {/* Synopsis */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-white mb-3">Synopsis</h3>
              <p className="text-gray-300 leading-relaxed">
                {anime.synopsis || "No synopsis available."}
              </p>
            </div>

            {/* External Link */}
            <a
              href={anime.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex"
            >
              <FaExternalLinkAlt className="text-sm" />
              View on MyAnimeList
            </a>
          </div>
        </div>

        {/* Trailer Section */}
        {anime.trailer?.embed_url && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center">
                <FaPlay className="text-white text-sm ml-0.5" />
              </div>
              Trailer
            </h2>
            <div className="relative w-full aspect-video max-w-4xl rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50">
              <iframe
                className="w-full h-full"
                src={anime.trailer.embed_url}
                title={`${anime.title} Trailer`}
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnimeDetails;
