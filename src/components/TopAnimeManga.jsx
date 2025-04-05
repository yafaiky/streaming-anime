import { useState, useEffect } from "react";
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

    fetchTopAnime();
  }, []);

  return (
    <div className="container mx-auto px-7 py-4 text-black">
      <div id="top-anime">
        <h4 className="text-2xl font-bold mb-4">Top Anime</h4>

        {loadingAnime ? (
          <p className="text-gray-500 text-center">Loading anime...</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
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
    </div>
  );
};

export default TopAnime;
