import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import AnimeDetails from "./pages/AnimeDetails";
import TopAnimeManga from "./components/TopAnimeManga";
import SearchPage from "./pages/SearchPage";

const App = () => {
  return (
    <>
      <Header /> {/* Tetap ada di semua halaman */}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/anime/:id" element={<AnimeDetails />} />
          <Route path="/top-anime-manga" element={<TopAnimeManga />} />
          <Route path="/search" element={<SearchPage />} />
        </Routes>
      </main>
    </>
  );
};

export default App;
