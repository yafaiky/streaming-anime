import { useEffect, useState } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import { FaPlay, FaStar, FaInfoCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

export default function AnimeCarousel() {
  const [animes, setAnimes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnimesWithFullData = async () => {
      try {
        const topAnimeRes = await axios.get("https://api.jikan.moe/v4/top/anime");
        const topAnimes = topAnimeRes.data.data.slice(0, 5);

        const fullData = await Promise.all(
          topAnimes.map(async (anime) => {
            try {
              const res = await axios.get(`https://api.jikan.moe/v4/anime/${anime.mal_id}/full`);
              return res.data.data;
            } catch (err) {
              console.error(`Failed to fetch full data for anime ID ${anime.mal_id}`);
              return anime;
            }
          })
        );

        setAnimes(fullData);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch anime full data:", err);
        setLoading(false);
      }
    };

    fetchAnimesWithFullData();
  }, []);

  if (loading) {
    return (
      <div className="carousel-container flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Loading top anime...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="carousel-container">
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        navigation
        pagination={{ 
          clickable: true,
          dynamicBullets: true
        }}
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        loop
        className="swiper-carousel"
      >
        {animes.map((anime, index) => (
          <SwiperSlide key={index}>
            <div
              className="slide"
              style={{
                backgroundImage: `url(${anime.images?.jpg?.large_image_url || anime.images?.webp?.large_image_url})`,
              }}
            >
              <div className="overlay" />
              <div className="slide-content">
                {/* Badges */}
                <div className="flex items-center gap-3 mb-4 flex-wrap">
                  {anime.score && (
                    <span className="flex items-center gap-1.5 bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 px-3 py-1.5 rounded-full text-sm font-semibold">
                      <FaStar className="text-xs" />
                      {anime.score}
                    </span>
                  )}
                  {anime.type && (
                    <span className="bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 px-3 py-1.5 rounded-full text-sm font-semibold">
                      {anime.type}
                    </span>
                  )}
                  {anime.episodes && (
                    <span className="bg-purple-500/20 border border-purple-500/30 text-purple-300 px-3 py-1.5 rounded-full text-sm font-semibold">
                      {anime.episodes} Episodes
                    </span>
                  )}
                  {anime.status && (
                    <span className={`px-3 py-1.5 rounded-full text-sm font-semibold border ${
                      anime.status === "Currently Airing" 
                        ? "bg-green-500/20 border-green-500/30 text-green-400"
                        : "bg-gray-500/20 border-gray-500/30 text-gray-400"
                    }`}>
                      {anime.status}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h2 className="title">{anime.title}</h2>
                
                {/* Japanese Title */}
                {anime.title_japanese && (
                  <p className="text-gray-400 text-sm mb-3 font-medium">
                    {anime.title_japanese}
                  </p>
                )}

                {/* Synopsis */}
                <p className="synopsis">
                  {anime.synopsis || "No synopsis available."}
                </p>

                {/* Genres */}
                {anime.genres && anime.genres.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-5">
                    {anime.genres.slice(0, 4).map((genre) => (
                      <span
                        key={genre.mal_id}
                        className="bg-white/10 backdrop-blur-sm text-white/80 px-3 py-1 rounded-full text-xs font-medium border border-white/10"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center gap-4 flex-wrap">
                  {anime.streaming && anime.streaming.length > 0 ? (
                    <a
                      href={anime.streaming[0].url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="watch-button"
                    >
                      <FaPlay className="text-sm" />
                      Watch on {anime.streaming[0].name}
                    </a>
                  ) : (
                    <span className="no-stream flex items-center gap-2">
                      <FaInfoCircle />
                      No streaming link available
                    </span>
                  )}
                  
                  <Link
                    to={`/anime/${anime.mal_id}`}
                    className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold hover:bg-white/20 transition-all duration-300"
                  >
                    <FaInfoCircle />
                    Details
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a1a] to-transparent pointer-events-none z-10" />
    </div>
  );
}
