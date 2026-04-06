import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { ChevronLeft, ChevronRight, Crown } from "lucide-react";

const TopCharactersCarousel = forwardRef((props, ref) => {
  const [characters, setCharacters] = useState([]);
  const [index, setIndex] = useState(0);
  const [itemsPerSlide, setItemsPerSlide] = useState(5);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const carouselRef = useRef(null);
  const fetchTimeout = useRef(null);

  useEffect(() => {
    const fetchCharacters = async () => {
      if (characters.length > 0) return;

      const controller = new AbortController();
      const signal = controller.signal;

      try {
        const response = await fetch("https://api.jikan.moe/v4/top/characters", { signal });
        if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
        const data = await response.json();
        setCharacters(data.data || []);
        setLoading(false);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Error fetching characters:", error);
          setError("Failed to load data. Please try again later.");
          setLoading(false);
        }
      }

      return () => controller.abort();
    };

    clearTimeout(fetchTimeout.current);
    fetchTimeout.current = setTimeout(() => {
      fetchCharacters();
    }, 500);

    const handleResize = () => {
      setItemsPerSlide(window.innerWidth >= 1024 ? 5 : window.innerWidth >= 768 ? 4 : 3);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(fetchTimeout.current);
    };
  }, []);

  useImperativeHandle(ref, () => ({
    scrollToCarousel: () => {
      if (carouselRef.current) {
        carouselRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    },
  }));

  const nextSlide = () => {
    setIndex((prev) =>
      prev + itemsPerSlide >= characters.length ? 0 : prev + itemsPerSlide
    );
  };

  const prevSlide = () => {
    setIndex((prev) =>
      prev - itemsPerSlide < 0
        ? Math.max(characters.length - itemsPerSlide, 0)
        : prev - itemsPerSlide
    );
  };

  return (
    <div
      id="top-characters"
      ref={carouselRef}
      className="relative w-full py-20 md:py-32 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #0a0a1a 0%, #12122a 50%, #0a0a1a 100%)'
      }}
    >
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-3xl" />
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Top Anime Characters
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              Most beloved characters of all time
            </p>
          </div>
        </div>

        {error && (
          <div className="text-center py-10">
            <p className="text-red-400 bg-red-500/10 px-6 py-3 rounded-xl inline-block border border-red-500/20">
              {error}
            </p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center gap-6 flex-wrap">
            {Array.from({ length: itemsPerSlide }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-3">
                <div className="skeleton w-24 h-32 md:w-32 md:h-40 rounded-2xl" />
                <div className="skeleton h-4 w-20 rounded" />
              </div>
            ))}
          </div>
        )}

        {/* Carousel Wrapper */}
        {!loading && characters.length > 0 && (
          <div className="relative flex items-center justify-center w-full">
            {/* Previous Button */}
            {characters.length > itemsPerSlide && (
              <button
                className="absolute left-0 md:left-4 z-20 p-3 md:p-4 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 text-white hover:bg-indigo-500/20 hover:border-indigo-500/30 transition-all duration-300 hover:scale-110 shadow-lg"
                onClick={prevSlide}
              >
                <ChevronLeft size={24} />
              </button>
            )}

            {/* Characters Grid */}
            <div className="flex items-center justify-center gap-4 md:gap-6 px-12 md:px-16 transition-all duration-500">
              {characters.slice(index, index + itemsPerSlide).map((char, i) => (
                <div
                  key={char.mal_id}
                  className="flex flex-col items-center group animate-fade-in"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className="relative">
                    {/* Rank badge */}
                    <div className="absolute -top-2 -left-2 z-10 w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110">
                      {index + i + 1}
                    </div>
                    
                    {/* Image container */}
                    <div className="relative rounded-2xl border-2 border-transparent group-hover:border-indigo-500/50 p-1 transition-all duration-500">
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
                      <img
                        src={char.images?.webp?.image_url || char.images?.jpg?.image_url}
                        alt={char.name}
                        className="relative rounded-xl w-24 h-32 md:w-32 md:h-40 object-cover shadow-xl group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      {/* Overlay on hover */}
                      <div className="absolute inset-1 rounded-xl bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-3">
                        <span className="text-white text-xs font-semibold">View</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Character name */}
                  <p className="mt-3 text-sm font-semibold text-white text-center w-24 md:w-32 group-hover:text-indigo-400 transition-colors duration-300 line-clamp-2">
                    {char.name}
                  </p>
                  {char.name_kanji && (
                    <p className="text-xs text-gray-500 text-center w-24 md:w-32 mt-0.5 line-clamp-1">
                      {char.name_kanji}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Next Button */}
            {characters.length > itemsPerSlide && (
              <button
                className="absolute right-0 md:right-4 z-20 p-3 md:p-4 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 text-white hover:bg-indigo-500/20 hover:border-indigo-500/30 transition-all duration-300 hover:scale-110 shadow-lg"
                onClick={nextSlide}
              >
                <ChevronRight size={24} />
              </button>
            )}
          </div>
        )}

        {/* Slider Indicators */}
        {!loading && characters.length > itemsPerSlide && (
          <div className="flex justify-center gap-2 mt-10">
            {Array.from({ length: Math.ceil(characters.length / itemsPerSlide) }).map((_, i) => (
              <button
                key={i}
                className={`h-2 rounded-full transition-all duration-500 ${
                  index >= i * itemsPerSlide && index < (i + 1) * itemsPerSlide
                    ? "bg-gradient-to-r from-indigo-500 to-purple-500 w-8"
                    : "bg-white/20 w-2 hover:bg-white/40"
                }`}
                onClick={() => setIndex(i * itemsPerSlide)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
});

export default TopCharactersCarousel;
