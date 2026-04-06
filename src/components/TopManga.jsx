import { useState, useEffect } from "react";
import { FaFire, FaChevronDown, FaChevronUp } from "react-icons/fa";
import MangaCard from "./MangaCard";

const TopManga = () => {
  const [mangaList, setMangaList] = useState([]);
  const [showMoreManga, setShowMoreManga] = useState(false);
  const [loadingManga, setLoadingManga] = useState(true);

  useEffect(() => {
    const fetchTopManga = async () => {
      try {
        const cachedManga = localStorage.getItem("topManga");
        if (cachedManga) {
          setMangaList(JSON.parse(cachedManga));
          setLoadingManga(false);
        } else {
          const response = await fetch("https://api.jikan.moe/v4/top/manga");
          await new Promise((resolve) => setTimeout(resolve, 1500));
          const data = await response.json();
          localStorage.setItem("topManga", JSON.stringify(data.data.slice(0, 20)));
          setMangaList(data.data.slice(0, 20));
          setLoadingManga(false);
        }
      } catch (error) {
        console.error("Error fetching top manga:", error);
        setLoadingManga(false);
      }
    };

    fetchTopManga();
  }, []);

  return (
    <div className="relative py-16 md:py-24">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div id="top-manga">
          {/* Section Header */}
          <div className="flex items-center gap-4 mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Top Manga
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                Most popular manga right now
              </p>
            </div>
          </div>

          {/* Loading State */}
          {loadingManga ? (
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
              {/* Manga Grid */}
              <div className="anime-grid">
                {mangaList.length > 0 &&
                  mangaList
                    .slice(0, showMoreManga ? mangaList.length : 10)
                    .map((manga, index) => (
                      <div
                        key={manga.mal_id}
                        className="animate-fade-in"
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        <MangaCard manga={manga} />
                      </div>
                    ))}
              </div>

              {/* Show More/Less Button */}
              {mangaList.length > 10 && (
                <div className="flex justify-center mt-12">
                  <button
                    className="btn-secondary group"
                    onClick={() => setShowMoreManga(!showMoreManga)}
                  >
                    {showMoreManga ? (
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

export default TopManga;
