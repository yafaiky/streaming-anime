import { useState, useEffect } from "react";
import AnimeCard from "./AnimeCard";
import MangaCard from "./MangaCard";

const TopAnimeManga = () => {
  const [animeList, setAnimeList] = useState([]);
  const [mangaList, setMangaList] = useState([]);
  const [showMoreAnime, setShowMoreAnime] = useState(false);
  const [showMoreManga, setShowMoreManga] = useState(false);
  const [loadingAnime, setLoadingAnime] = useState(true);
  const [loadingManga, setLoadingManga] = useState(true);

  useEffect(() => {
    const fetchTopAnime = async () => {
      try {
        const cachedAnime = localStorage.getItem("topAnime");
        if (cachedAnime) {
          setAnimeList(JSON.parse(cachedAnime));
          setLoadingAnime(false);
        } else {
          const response = await fetch("https://api.jikan.moe/v4/top/anime");
          await new Promise((resolve) => setTimeout(resolve, 1500)); // Delay 1.5 detik
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

    const fetchTopManga = async () => {
      try {
        const cachedManga = localStorage.getItem("topManga");
        if (cachedManga) {
          setMangaList(JSON.parse(cachedManga));
          setLoadingManga(false);
        } else {
          const response = await fetch("https://api.jikan.moe/v4/top/manga?sfw=true");
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

    fetchTopAnime();
    fetchTopManga();
  }, []);

  return (
    <div className="p-4 text-black">
      {/* Top Anime Section */}
      <div id="top-anime">
        <h4 className="text-2xl font-bold mb-4">Top Anime</h4>

        {loadingAnime ? (
          <p className="text-gray-500 text-center">Loading anime...</p>
        ) : (
          <div className="grid grid-cols-2   md:grid-cols-3 lg:grid-cols-5 gap-4">
            {animeList.length > 0 &&
              animeList
                .slice(0, showMoreAnime ? animeList.length : 10)
                .map((anime) => <AnimeCard key={anime.mal_id} anime={anime} />)}
          </div>
        )}

        <div className="text-center mt-4">
          <button
            className="text-gray-700 px-4 py-2 rounded-lg border border-gray-500 hover:bg-gray-300"
            onClick={() => setShowMoreAnime(!showMoreAnime)}
          >
            {showMoreAnime ? "Show Less" : "See More"}
          </button>
        </div>
      </div>

      {/* Top Manga Section */}
      <div id="top-manga">
        <h4 className="text-2xl font-bold mt-8 mb-4">Top Manga</h4>

        {loadingManga ? (
          <p className="text-gray-500 text-center">Loading manga...</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {mangaList.length > 0 &&
              mangaList
                .slice(0, showMoreManga ? mangaList.length : 10)
                .map((manga) => <MangaCard key={manga.mal_id} manga={manga} />)}
          </div>
        )}

        <div className="text-center mt-4">
          <button
            className="text-gray-700 px-4 py-2 rounded-lg border border-gray-500 hover:bg-gray-300"
            onClick={() => setShowMoreManga(!showMoreManga)}
          >
            {showMoreManga ? "Show Less" : "See More"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopAnimeManga;
