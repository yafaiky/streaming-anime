import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const MangaCard = ({ manga }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      className="bg-white shadow-lg rounded-lg p-4 flex flex-col h-full cursor-pointer"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
      onClick={() => navigate(`/manga/${manga.mal_id}`)} // Klik Card juga bisa navigate
    >
      <img
        src={manga.images?.webp?.image_url}
        alt={manga.title}
        className="w-full h-48 object-contain rounded-md"
      />
      <div className="flex flex-col flex-grow justify-between">
        <h3 className="text-lg font-bold mt-2">{manga.title}</h3>
        <p className="text-yellow-500 flex items-center">⭐ {manga.score}</p>
        <button
          className="bg-yellow-500 text-white py-2 rounded-lg mt-2"
          onClick={(e) => {
            e.stopPropagation(); // Supaya klik tombol tidak trigger klik di card
            navigate(`/manga/${manga.mal_id}`);
          }}
        >
          Details
        </button>
      </div>
    </motion.div>
  );
};

export default MangaCard;
