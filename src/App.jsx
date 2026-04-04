import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import AnimeDetails from "./pages/AnimeDetails";
import TopAnimeManga from "./components/TopAnimeManga";
import SearchPage from "./pages/SearchPage";
import ForumPage from "./pages/ForumPage";

const App = () => {
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/anime/:id" element={<AnimeDetails />} />
          <Route path="/anime/:id/forum" element={<ForumPage />} />
          <Route path="/top-anime-manga" element={<TopAnimeManga />} />
          <Route path="/search" element={<SearchPage />} />
        </Routes>
      </main>
    </>
  );
};

export default App;
