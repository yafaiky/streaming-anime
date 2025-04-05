import { Link } from "react-router-dom";

const AnimeCard = ({ anime }) => {
  return (
    <div className="anime-card">
      <Link to={`/anime/${anime.mal_id}`}>
        <div className="image-container">
          <img
            src={anime.images?.webp?.image_url}
            alt={anime.title}
            className="anime-image"
          />
          <div className="anime-overlay">
            <h3 className="anime-title">{anime.title}</h3>
            <p className="anime-description">
              {anime.synopsis ? anime.synopsis.slice(0, 100) + "..." : "No synopsis available."}
            </p>
          </div>
        </div>
        <h3 className="anime-text-title">{anime.title}</h3>
        <p className="anime-subtext">{anime.year}</p>
      </Link>
    </div>
  );
};

export default AnimeCard;
