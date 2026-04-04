import AnimeCarousel from "../components/AnimeCarousel";
import TopCharacters from "../components/TopCharacters";
import TopAnimeManga from "../components/TopAnimeManga";
import TopManga from "../components/TopManga";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      <AnimeCarousel />
      <TopAnimeManga />
      <TopManga />
      <TopCharacters />
      <Footer />
    </div>
  );
};

export default Home;
