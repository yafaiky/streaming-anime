import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const TopCharactersCarousel = forwardRef((props, ref) => {
  const [characters, setCharacters] = useState([]);
  const [index, setIndex] = useState(0);
  const [itemsPerSlide, setItemsPerSlide] = useState(3);
  const [error, setError] = useState(null);
  const carouselRef = useRef(null);
  const fetchTimeout = useRef(null); // Untuk debounce API request

  useEffect(() => {
    const fetchCharacters = async () => {
      if (characters.length > 0) return; // Hindari request berulang jika data sudah ada

      const controller = new AbortController(); // Untuk membatalkan fetch jika perlu
      const signal = controller.signal;

      try {
        const response = await fetch("https://api.jikan.moe/v4/top/characters", { signal });
        if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
        const data = await response.json();
        setCharacters(data.data || []);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Error fetching characters:", error);
          setError("Failed to load data. Please try again later.");
        }
      }

      return () => controller.abort(); // Hentikan request jika komponen unmount
    };

    // Gunakan timeout untuk menghindari terlalu sering fetch saat resize
    clearTimeout(fetchTimeout.current);
    fetchTimeout.current = setTimeout(() => {
      fetchCharacters();
    }, 500);

    const handleResize = () => {
      setItemsPerSlide(window.innerWidth >= 768 ? 5 : 3);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(fetchTimeout.current); // Hapus timeout saat komponen unmount
    };
  }, []);

  // Expose scroll function ke parent
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
    <div id="top-characters" ref={carouselRef} className="relative w-full bg-gray-900 py-40 px-4">
      <h2 className="text-2xl font-bold text-white text-center mb-4">
        Top Anime Characters
      </h2>

      {error && <p className="text-red-500 text-center">{error}</p>}

      {/* Carousel Wrapper */}
      <div className="relative flex items-center justify-center w-full overflow-hidden">
        {characters.length > 0 && (
          <div className="grid grid-cols-3 md:grid-cols-5 gap-4 transition-all duration-500">
            {characters.slice(index, index + itemsPerSlide).map((char) => (
              <div key={char.mal_id} className="flex flex-col items-center">
                <div className="rounded-lg border-2 border-transparent hover:border-white p-1 transition-all duration-300">
                  <img
                    src={char.images.webp.image_url}
                    alt={char.name}
                    className="rounded-lg w-24 h-32 md:w-32 md:h-40 object-cover shadow-lg hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <p className="mt-2 text-sm font-semibold text-white text-center w-24 md:w-36">
                  {char.name}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Slider Controls */}
      {characters.length > itemsPerSlide && (
        <>
          <button
            className="absolute top-1/2 transform -translate-y-1/2 left-2 md:left-6 text-white p-2 md:p-3 rounded-full shadow-lg bg-black bg-opacity-50 hover:bg-opacity-75 transition"
            onClick={prevSlide}
          >
            <ChevronLeft size={30} />
          </button>

          <button
            className="absolute top-1/2 transform -translate-y-1/2 right-2 md:right-6 text-white p-2 md:p-3 rounded-full shadow-lg bg-black bg-opacity-50 hover:bg-opacity-75 transition"
            onClick={nextSlide}
          >
            <ChevronRight size={30} />
          </button>
        </>
      )}

      {/* Slider Indicators */}
      {characters.length > itemsPerSlide && (
        <div className="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-2">
          {Array.from({ length: Math.ceil(characters.length / itemsPerSlide) }).map((_, i) => (
            <button
              key={i}
              className={`w-3 h-3 rounded-full ${
                index >= i * itemsPerSlide && index < (i + 1) * itemsPerSlide
                  ? "bg-white"
                  : "bg-gray-500"
              }`}
              onClick={() => setIndex(i * itemsPerSlide)}
            ></button>
          ))}
        </div>
      )}
    </div>
  );
});

export default TopCharactersCarousel;
