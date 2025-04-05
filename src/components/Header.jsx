import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaRegBookmark,
  FaRegLifeRing,
  FaUserCircle,
} from "react-icons/fa";
import { Link as ScrollLink } from "react-scroll";

function Navbar() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${query}`);
    }
  };

  return (
    <nav className="bg-gray-900 text-white p-4 flex justify-between items-center">
      {/* Logo */}
      <div className="text-yellow-500 font-bold text-2xl">
        <Link to="/" className="text-white no-underline hover:text-gray-300">
          OtakuList
        </Link>
      </div>

      {/* Menu */}
      <div className="hidden md:flex space-x-6 cursor-pointer text-white">
        <ScrollLink
          to="top-anime"
          smooth={true}
          duration={100}
          className="hover:text-gray-400"
        >
          Top Anime
        </ScrollLink>
        
        <ScrollLink
          to="top-characters"
          smooth={true}
          duration={100}
          className="hover:text-gray-400"
        >
          Top Characters
        </ScrollLink>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="relative w-64">
        <input
          type="text"
          className="px-4 py-2 pr-10 rounded-lg bg-gray-800 text-white focus:outline-none w-full"
          placeholder="Search Anime..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" className="absolute right-3 top-3 text-gray-500">
          <FaSearch />
        </button>
      </form>

      
    </nav>
  );
}

export default Navbar;
