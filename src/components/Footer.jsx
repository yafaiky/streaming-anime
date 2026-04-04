import { FaTwitter, FaYoutube, FaFacebook, FaGithub, FaHeart, FaDiscord } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-auto">
      {/* Top gradient border */}
      <div className="h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

      <div className="relative bg-[#0a0a1a] pt-16 pb-8">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <Link to="/" className="flex items-center gap-3 mb-4 group">
                <span className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors duration-300">
                  OtakuList
                </span>
              </Link>
              <p className="text-gray-400 text-sm leading-relaxed max-w-md mb-6">
                Your ultimate destination for discovering and exploring anime. 
                Browse top anime, discover new characters, and find your next favorite series.
              </p>
              {/* Social Links */}
              <div className="flex items-center gap-3">
                {[
                  // { icon: FaTwitter, href: "#", color: "hover:text-blue-400", bg: "hover:bg-blue-400/10" },
                  // { icon: FaYoutube, href: "#", color: "hover:text-red-500", bg: "hover:bg-red-500/10" },
                  // { icon: FaFacebook, href: "#", color: "hover:text-blue-600", bg: "hover:bg-blue-600/10" },
                  // { icon: FaDiscord, href: "#", color: "hover:text-indigo-400", bg: "hover:bg-indigo-400/10" },
                  { icon: FaGithub, href: "https://github.com/yafaiky/streaming-anime", color: "hover:text-white", bg: "hover:bg-white/10" },
                ].map((social, i) => (
                  <a
                    key={i}
                    href={social.href}
                    className={`p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 ${social.color} ${social.bg} transition-all duration-300 hover:scale-110 hover:border-transparent`}
                  >
                    <social.icon size={18} />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
                Quick Links
              </h4>
              <ul className="space-y-3">
                {[
                  { label: "Home", path: "/" },
                  { label: "Top Anime", path: "/#top-anime" },
                  { label: "Top Characters", path: "/#top-characters" },
                  { label: "Search", path: "/search" },
                ].map((link, i) => (
                  <li key={i}>
                    <Link
                      to={link.path}
                      className="text-gray-400 hover:text-indigo-400 transition-colors duration-300 text-sm flex items-center gap-2 group"
                    >
                      <span className="w-1 h-1 rounded-full bg-gray-600 group-hover:bg-indigo-400 transition-colors duration-300" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
                Resources
              </h4>
              <ul className="space-y-3">
                {[
                  { label: "MyAnimeList", href: "https://myanimelist.net" },
                  { label: "API Documentation", href: "https://docs.api.jikan.moe" },
                  { label: "About Us", href: "#" },
                  { label: "Contact", href: "#" },
                ].map((link, i) => (
                  <li key={i}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-indigo-400 transition-colors duration-300 text-sm flex items-center gap-2 group"
                    >
                      <span className="w-1 h-1 rounded-full bg-gray-600 group-hover:bg-indigo-400 transition-colors duration-300" />
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8" />

          {/* Bottom Section */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm flex items-center gap-1.5">
              © {currentYear} OtakuList. Made with{" "}
              <FaHeart className="text-red-500 text-xs animate-pulse" /> for anime fans
            </p>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <a href="#" className="hover:text-indigo-400 transition-colors duration-300">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-indigo-400 transition-colors duration-300">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
