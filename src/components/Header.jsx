import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaSearch, FaBars, FaTimes } from "react-icons/fa";
import { Link as ScrollLink } from "react-scroll";

function Navbar() {
  const [query, setQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${query}`);
      setQuery("");
      setIsMobileMenuOpen(false);
    }
  };

  const isHomePage = location.pathname === "/";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-[#0a0a1a]/80 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/20"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 group"
          >
            <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent group-hover:from-indigo-400 group-hover:to-purple-400 transition-all duration-300">
              OtakuList
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {isHomePage ? (
              <>
                <ScrollLink
                  to="top-anime"
                  smooth={true}
                  duration={500}
                  offset={-80}
                  className="relative text-gray-300 hover:text-white cursor-pointer transition-colors duration-300 group"
                >
                  <span>Top Anime</span>
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 group-hover:w-full transition-all duration-300" />
                </ScrollLink>
                <ScrollLink
                  to="top-characters"
                  smooth={true}
                  duration={500}
                  offset={-80}
                  className="relative text-gray-300 hover:text-white cursor-pointer transition-colors duration-300 group"
                >
                  <span>Top Characters</span>
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 group-hover:w-full transition-all duration-300" />
                </ScrollLink>
              </>
            ) : (
              <Link
                to="/"
                className="relative text-gray-300 hover:text-white transition-colors duration-300 group"
              >
                <span>Home</span>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 group-hover:w-full transition-all duration-300" />
              </Link>
            )}
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex relative">
            <div className="relative group">
              <input
                type="text"
                className="w-64 lg:w-80 px-5 py-2.5 pl-12 rounded-full bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300"
                placeholder="Search anime..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-400 transition-colors duration-300" />
            </div>
          </form>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-500 ${
            isMobileMenuOpen ? "max-h-96 opacity-100 pb-6" : "max-h-0 opacity-0"
          }`}
        >
          <div className="flex flex-col gap-4 pt-4 border-t border-white/10">
            {isHomePage ? (
              <>
                <ScrollLink
                  to="top-anime"
                  smooth={true}
                  duration={500}
                  offset={-80}
                  className="text-gray-300 hover:text-white cursor-pointer transition-colors duration-300 py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Top Anime
                </ScrollLink>
                <ScrollLink
                  to="top-characters"
                  smooth={true}
                  duration={500}
                  offset={-80}
                  className="text-gray-300 hover:text-white cursor-pointer transition-colors duration-300 py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Top Characters
                </ScrollLink>
              </>
            ) : (
              <Link
                to="/"
                className="text-gray-300 hover:text-white transition-colors duration-300 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
            )}

            {/* Mobile Search */}
            <form onSubmit={handleSearchSubmit} className="relative mt-2">
              <input
                type="text"
                className="w-full px-5 py-3 pl-12 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 transition-all duration-300"
                placeholder="Search anime..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            </form>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
