import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { FaArrowLeft, FaStar, FaHeart, FaExternalLinkAlt, FaCalendar, FaBook } from "react-icons/fa";

const API_BASE_URL = import.meta.env.VITE_ANIME_API_BASE_URL;

const MangaDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [manga, setManga] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a1a]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Loading manga details...</p>
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
            onClick={() => navigate("/manga")}
          >
            <FaArrowLeft /> Back to Manga
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a1a] pt-20">
      {/* Hero Banner */}
      <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${manga.images?.jpg?.large_image_url || manga.images?.jpg?.image_url})`,
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
          onClick={() => navigate("/manga")}
        >
          <FaArrowLeft className="text-sm group-hover:-translate-x-1 transition-transform duration-300" />
          Back to Manga
        </button>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Cover Image */}
          <div className="flex-shrink-0">
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-br from-indigo-500/30 to-purple-500/30 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <img
                src={manga.images?.jpg?.large_image_url || manga.images?.jpg?.image_url}
                alt={manga.title}
                className="relative w-64 md:w-72 rounded-2xl shadow-2xl shadow-black/50 border border-white/10"
              />
              {/* Score badge */}
              {manga.score && (
                <div className="absolute -top-3 -right-3 bg-gradient-to-br from-yellow-500 to-orange-600 text-white px-4 py-2 rounded-xl font-bold shadow-lg flex items-center gap-2">
                  <FaStar className="text-sm" />
                  {manga.score}
                </div>
              )}
            </div>
          </div>

          {/* Details Content */}
          <div className="flex-1 min-w-0">
            {/* Title Section */}
            <div className="mb-6">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 leading-tight">
                {manga.title}
              </h1>
              {manga.title_japanese && (
                <p className="text-gray-400 text-lg italic">
                  {manga.title_japanese}
                </p>
              )}
            </div>

            {/* Quick Stats */}
            <div className="flex flex-wrap gap-3 mb-8">
              {manga.type && (
                <span className="flex items-center gap-2 bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 px-4 py-2 rounded-xl text-sm font-semibold">
                  <FaBook className="text-xs" />
                  {manga.type}
                </span>
              )}
              {manga.status && (
                <span className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border ${
                  manga.status === "Publishing"
                    ? "bg-green-500/15 border-green-500/30 text-green-400"
                    : "bg-gray-500/15 border-gray-500/30 text-gray-400"
                }`}>
                  {manga.status}
                </span>
              )}
              {manga.chapters && (
                <span className="flex items-center gap-2 bg-purple-500/15 border border-purple-500/30 text-purple-300 px-4 py-2 rounded-xl text-sm font-semibold">
                  {manga.chapters} Chapters
                </span>
              )}
              {manga.volumes && (
                <span className="flex items-center gap-2 bg-orange-500/15 border border-orange-500/30 text-orange-300 px-4 py-2 rounded-xl text-sm font-semibold">
                  {manga.volumes} Volumes
                </span>
              )}
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: "Score", value: manga.score || "N/A", icon: FaStar, color: "text-yellow-400" },
                { label: "Rank", value: `#${manga.rank || "N/A"}`, icon: null, color: "text-indigo-400" },
                { label: "Popularity", value: `#${manga.popularity || "N/A"}`, icon: null, color: "text-purple-400" },
                { label: "Favorites", value: manga.favorites?.toLocaleString() || "0", icon: FaHeart, color: "text-red-400" },
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
            {manga.genres && manga.genres.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Genres</h3>
                <div className="flex flex-wrap gap-2">
                  {manga.genres.map((genre) => (
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
            {manga.themes && manga.themes.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Themes</h3>
                <div className="flex flex-wrap gap-2">
                  {manga.themes.map((theme) => (
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
            {manga.demographics && manga.demographics.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Demographics</h3>
                <div className="flex flex-wrap gap-2">
                  {manga.demographics.map((demo) => (
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
              {manga.authors && manga.authors.length > 0 && (
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Authors</p>
                  <p className="text-white font-medium">
                    {manga.authors.map((a) => a.name).join(", ")}
                  </p>
                </div>
              )}
              {manga.serializations && manga.serializations.length > 0 && (
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Serializations</p>
                  <p className="text-white font-medium">
                    {manga.serializations.slice(0, 3).map((s) => s.name).join(", ")}
                  </p>
                </div>
              )}
              {manga.published?.string && (
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <p className="text-gray-500 text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <FaCalendar className="text-xs" /> Published
                  </p>
                  <p className="text-white font-medium">{manga.published.string}</p>
                </div>
              )}
              {manga.members && (
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Members</p>
                  <p className="text-white font-medium">{manga.members.toLocaleString()}</p>
                </div>
              )}
            </div>

            {/* Synopsis */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-white mb-3">Synopsis</h3>
              <p className="text-gray-300 leading-relaxed">
                {manga.synopsis || "No synopsis available."}
              </p>
            </div>

            {/* Action Button */}
            <div className="flex flex-wrap gap-3">
              <a
                href={manga.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex"
              >
                <FaExternalLinkAlt className="text-sm" />
                View on MyAnimeList
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MangaDetails;
