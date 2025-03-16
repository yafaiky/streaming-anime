import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom"; // Assuming you're using react-router for navigation

const AnimeCarousel = () => {
  const [animeList, setAnimeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRandomAnime = async () => {
      try {
        const requests = Array.from({ length: 6 }, () =>
          fetch(`${import.meta.env.VITE_ANIME_API_BASE_URL}/random/anime`).then((res) => res.json())
        );

        const responses = await Promise.all(requests);
        const randomAnimes = responses.map((data) => data.data);

        setAnimeList(randomAnimes);
        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        setError("Error fetching random anime");
        setLoading(false); // Set loading to false if there is an error
      }
    };

    fetchRandomAnime();
  }, []);

  if (loading) {
    return <div className="text-sm font-bold"> Loading...</div>; // Display loading state
  }

  if (error) {
    return <div>{error}</div>; // Display error state
  }

  return (
    <div id="carouselExampleCaptions" className="carousel slide" data-bs-ride="carousel">
      {/* Indicators */}
      <div className="carousel-indicators">
        {animeList.map((_, index) => (
          <button
            key={index}
            type="button"
            data-bs-target="#carouselExampleCaptions"
            data-bs-slide-to={index}
            className={index === 0 ? "active" : ""}
            aria-current={index === 0 ? "true" : "false"}
            aria-label={`Slide ${index + 1}`}
          ></button>
        ))}
      </div>

      {/* Carousel Items */}
      <div className="carousel-inner">
        {animeList.map((anime, index) => (
          <div key={anime.mal_id} className={`carousel-item ${index === 0 ? "active" : ""}`}>
            <Link to={`/anime/${anime.mal_id}`} className="text-decoration-none">
              <img src={anime.images.webp.image_url} className="d-block w-100" alt={anime.title} />
              <div className="carousel-caption d-none d-md-block bg-dark bg-opacity-75 p-3 rounded">
                <h5>{anime.title}</h5>
                <p>⭐ {anime.rating || "N/A"} | 📺 {anime.episodes || "Unknown"} episodes</p>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Controls */}
      <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
};

export default AnimeCarousel;
