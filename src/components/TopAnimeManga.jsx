import { useState, useEffect } from "react";
import { FaFire, FaChevronDown, FaChevronUp } from "react-icons/fa";
import AnimeCard from "./AnimeCard";

const TopAnime = () => {
  const [animeList, setAnimeList] = useState([]);
  const [showMoreAnime, setShowMoreAnime] = useState(false);
  const [loadingAnime, setLoadingAnime] = useState(true);

  useEffect(() => {
    const fetchTopAnime = async () => {
      try {
        const cachedAnime = localStorage.getItem("topAnime");
        if (cachedAnime) {
          setAnimeList(JSON.parse(cachedAnime));
          setLoadingAnime(false);
        } else {
          const response = await fetch("https://api.jikan.moe/v4/top/anime");
          await new Promise((resolve) => setTimeout(resolve, 1500));
          const data = await response.json();
          localStorage.setItem("topAnime", JSON.stringify(data.data.slice(0, 20)));
          setAnimeList(data.data.slice(0, 20));
          setLoadingAnime(false);
        }
      } catch (error) {
        console.error("Error fetching top anime:", error);
        setLoadingAnime(false);
      }
    };

    fetchTopAnime();
  }, []);

  return (
    <div className="relative py-16 md:py-24">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div id="top-anime">
          {/* Section Header */}
          <div className="flex items-center gap-4 mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Top Anime
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                Most popular anime right now
              </p>
            </div>
          </div>

          {/* Loading State */}
          {loadingAnime ? (
            <div className="anime-grid">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="w-full max-w-[200px]">
                  <div className="skeleton aspect-[3/4] rounded-2xl" />
                  <div className="skeleton h-4 w-3/4 mt-3 rounded" />
                  <div className="skeleton h-3 w-1/2 mt-2 rounded" />
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* Anime Grid */}
              <div className="anime-grid">
                {animeList.length > 0 &&
                  animeList
                    .slice(0, showMoreAnime ? animeList.length : 10)
                    .map((anime, index) => (
                      <div
                        key={anime.mal_id}
                        className="animate-fade-in"
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        <AnimeCard anime={anime} />
                      </div>
                    ))}
              </div>

              {/* Show More/Less Button */}
              {animeList.length > 10 && (
                <div className="flex justify-center mt-12">
                  <button
                    className="btn-secondary group"
                    onClick={() => setShowMoreAnime(!showMoreAnime)}
                  >
                    {showMoreAnime ? (
                      <>
                        <FaChevronUp className="text-sm group-hover:-translate-y-0.5 transition-transform duration-300" />
                        Show Less
                      </>
                    ) : (
                      <>
                        <FaChevronDown className="text-sm group-hover:translate-y-0.5 transition-transform duration-300" />
                        See More
                      </>
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopAnime;
