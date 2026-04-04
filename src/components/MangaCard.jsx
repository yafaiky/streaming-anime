import { Link } from "react-router-dom";
import { FaStar, FaPlay } from "react-icons/fa";

const MangaCard = ({ manga }) => {
  return (
    <div className="anime-card group">
      <Link to={`/manga/${manga.mal_id}`}>
        <div className="image-container">
          <img
            src={manga.images?.webp?.image_url || manga.images?.jpg?.image_url}
            alt={manga.title}
            className="anime-image"
            loading="lazy"
          />
          <div className="anime-overlay">
            <div className="flex items-center gap-2 mb-2">
              {manga.score && (
                <span className="flex items-center gap-1 bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-md text-xs font-semibold">
                  <FaStar className="text-[10px]" />
                  {manga.score}
                </span>
              )}
              {manga.type && (
                <span className="bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded-md text-xs font-semibold">
                  {manga.type}
                </span>
              )}
            </div>
            <h3 className="anime-title">{manga.title}</h3>
            <p className="anime-description">
              {manga.synopsis ? manga.synopsis.slice(0, 120) + "..." : "No synopsis available."}
            </p>
            <div className="mt-3 flex items-center gap-2 text-indigo-400 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <FaPlay className="text-[10px]" />
              <span>View Details</span>
            </div>
          </div>
          {/* Gradient border effect */}
          <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.3), rgba(139, 92, 246, 0.3))',
              mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              maskComposite: 'exclude',
              WebkitMaskComposite: 'xor',
              padding: '2px'
            }}
          />
        </div>
        <div className="mt-3 px-1">
          <h3 className="anime-text-title group-hover:text-indigo-400 transition-colors duration-300">
            {manga.title}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            {manga.chapters && (
              <span className="anime-subtext">{manga.chapters} chapters</span>
            )}
            {manga.volumes && (
              <>
                <span className="text-zinc-600">•</span>
                <span className="anime-subtext">{manga.volumes} volumes</span>
              </>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default MangaCard;
