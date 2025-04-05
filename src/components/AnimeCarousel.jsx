import { useEffect, useState } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function AnimeCarousel() {
  const [animes, setAnimes] = useState([]);

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
      } catch (err) {
        console.error("Failed to fetch anime full data:", err);
      }
    };

    fetchAnimesWithFullData();
  }, []);

  return (
    <div className="carousel-container">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000 }}
        loop
        className="swiper-carousel"
      >
        {animes.map((anime, index) => (
          <SwiperSlide key={index}>
            <div
              className="slide"
              style={{
                backgroundImage: `url(${anime.images.jpg.large_image_url})`,
              }}
            >
              <div className="overlay" />
              <div className="slide-content">
                <h2 className="title">{anime.title}</h2>
                <p className="synopsis">{anime.synopsis}</p>
                <p className="score">Score: {anime.score || "N/A"}</p>
                {anime.streaming && anime.streaming.length > 0 ? (
                  <a
                    href={anime.streaming[0].url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="watch-button"
                  >
                    Watch on {anime.streaming[0].name}
                  </a>
                ) : (
                  <span className="no-stream">No streaming link available</span>
                )}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
