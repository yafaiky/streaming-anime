import { motion } from "framer-motion";
import { Link } from "react-router-dom"; // ✅ Tambahkan import

const AnimeCard = ({ anime }) => {
  return (
    <motion.div
      className="bg-white shadow-lg rounded-lg p-3 flex flex-col h-full"
      initial={{ opacity: 0, y: 30 }} // Muncul dari bawah
      animate={{ opacity: 1, y: 0 }} // Efek muncul
      whileHover={{ scale: 1.05 }} // Animasi saat hover
      transition={{ duration: 0.3 }}
    >
      <img
        src={anime.images?.webp?.image_url}
        alt={anime.title}
        className="w-full object-contain h-48 rounded-md"
      />
      <div className="flex flex-col flex-grow justify-between">
        <h3 className="text-lg font-bold mt-2">{anime.title}</h3>
        <p className="text-yellow-500 flex items-center">⭐ {anime.rating} </p>
        <Link
          to={`/anime/${anime.mal_id}`}
          className="bg-yellow-500 text-white py-2 rounded-lg mt-2 text-center"
        >
          Details
        </Link>
      </div>
    </motion.div>
  );
};

export default AnimeCard;
