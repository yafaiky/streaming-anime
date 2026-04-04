import { useState, memo, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  FaTag,
  FaPalette,
  FaUsers,
  FaFire,
  FaLayerGroup,
  FaRedo,
  FaSearch,
  FaTimes,
} from "react-icons/fa";
import useAnimeGenres from "../hooks/useAnimeGenres";

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */

/**
 * Warna chip berdasarkan jumlah anime (count).
 * Semakin banyak = warna lebih "panas".
 */
const getChipAccent = (count) => {
  if (!count) return "chip--neutral";
  if (count >= 5000)  return "chip--fire";
  if (count >= 2000)  return "chip--hot";
  if (count >= 500)   return "chip--warm";
  if (count >= 100)   return "chip--cool";
  return "chip--neutral";
};

/* ─────────────────────────────────────────────
   Skeleton Chips
───────────────────────────────────────────── */
const ChipSkeletonGroup = memo(({ count = 20 }) => (
  <div className="genre-chip-grid">
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className="skeleton genre-chip-skeleton"
        style={{ width: `${5 + Math.random() * 4}rem`, animationDelay: `${i * 0.04}s` }}
        aria-hidden="true"
      />
    ))}
  </div>
));
ChipSkeletonGroup.displayName = "ChipSkeletonGroup";

const FullPageSkeleton = memo(() => (
  <div className="genre-page__body">
    {[28, 14, 6].map((count, i) => (
      <section key={i} className="genre-section">
        <div className="skeleton skeleton--group-title" />
        <ChipSkeletonGroup count={count} />
      </section>
    ))}
  </div>
));
FullPageSkeleton.displayName = "FullPageSkeleton";

/* ─────────────────────────────────────────────
   Genre Chip (single chip)
───────────────────────────────────────────── */
const GenreChip = memo(({ item, index }) => {
  const accentClass = getChipAccent(item.count);
  // Encode nama genre agar aman di URL (e.g. "Slice of Life" → "Slice%20of%20Life")
  const encodedName = encodeURIComponent(item.name);

  return (
    <Link
      to={`/genre/${item.mal_id}/${encodedName}`}
      className={`genre-chip ${accentClass}`}
      style={{ animationDelay: `${Math.min(index, 29) * 0.03}s` }}
      aria-label={`${item.name} — ${item.count?.toLocaleString("id-ID") ?? "?"} anime`}
      id={`genre-chip-${item.mal_id}`}
    >
      {/* Hover glow */}
      <span className="genre-chip__glow" aria-hidden="true" />

      <span className="genre-chip__name">{item.name}</span>
      {item.count !== undefined && (
        <span className="genre-chip__count">
          {item.count >= 1000
            ? `${(item.count / 1000).toFixed(1)}k`
            : item.count}
        </span>
      )}
    </Link>
  );
});
GenreChip.displayName = "GenreChip";


/* ─────────────────────────────────────────────
   Genre Group Section
───────────────────────────────────────────── */
const GenreGroup = memo(({ title, icon: Icon, items, accentColor, searchValue }) => {
  // Filter berdasarkan search query
  const filtered = searchValue
    ? items.filter((item) =>
        item.name.toLowerCase().includes(searchValue.toLowerCase())
      )
    : items;

  if (filtered.length === 0 && searchValue) return null;

  return (
    <section className="genre-section" aria-labelledby={`section-${title}`}>
      {/* Group Header */}
      <div className="genre-section__header">
        <div
          className="genre-section__icon-wrap"
          style={{ background: accentColor.bg, borderColor: accentColor.border }}
          aria-hidden="true"
        >
          <Icon style={{ color: accentColor.text }} />
        </div>
        <div>
          <h2 id={`section-${title}`} className="genre-section__title">
            {title}
          </h2>
          <p className="genre-section__count">{filtered.length} item</p>
        </div>
      </div>

      {/* Chips Grid */}
      <div className="genre-chip-grid" role="list">
        {filtered.map((item, index) => (
          <GenreChip key={item.mal_id} item={item} index={index} />
        ))}
      </div>
    </section>
  );
});
GenreGroup.displayName = "GenreGroup";

/* ─────────────────────────────────────────────
   Search Bar
───────────────────────────────────────────── */
const GenreSearch = memo(({ value, onChange, onClear, totalVisible, totalAll }) => (
  <div className="genre-search-wrap">
    <div className="genre-search-inner">
      <FaSearch className="genre-search__icon" aria-hidden="true" />
      <input
        id="input-search-genre"
        type="search"
        className="genre-search__input"
        placeholder="Cari genre, tema, atau demografis…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Cari genre"
        autoComplete="off"
      />
      {value && (
        <button
          className="genre-search__clear"
          onClick={onClear}
          aria-label="Hapus pencarian"
          id="btn-clear-genre-search"
        >
          <FaTimes />
        </button>
      )}
    </div>
    {value && (
      <p className="genre-search__result-text">
        Menampilkan <strong>{totalVisible}</strong> dari {totalAll} item
      </p>
    )}
  </div>
));
GenreSearch.displayName = "GenreSearch";

/* ─────────────────────────────────────────────
   Error State
───────────────────────────────────────────── */
const GenreError = memo(({ message, onRetry }) => (
  <div className="genre-empty genre-empty--error" role="alert">
    <span className="genre-empty__icon" aria-hidden="true">⚠️</span>
    <p className="genre-empty__text genre-empty__text--error">{message}</p>
    <button
      id="btn-retry-genres"
      className="genre-retry-btn"
      onClick={onRetry}
    >
      <FaRedo aria-hidden="true" />
      Coba Lagi
    </button>
  </div>
));
GenreError.displayName = "GenreError";

/* ─────────────────────────────────────────────
   No Results State
───────────────────────────────────────────── */
const GenreNoResults = memo(({ query, onClear }) => (
  <div className="genre-empty">
    <span className="genre-empty__icon" aria-hidden="true">🔍</span>
    <p className="genre-empty__text">
      Tidak ada genre yang cocok dengan "<strong>{query}</strong>".
    </p>
    <button className="genre-retry-btn" onClick={onClear}>
      <FaTimes aria-hidden="true" />
      Hapus Pencarian
    </button>
  </div>
));
GenreNoResults.displayName = "GenreNoResults";

/* ─────────────────────────────────────────────
   Stats Bar
───────────────────────────────────────────── */
const StatsBar = memo(({ genres, themes, demographics }) => (
  <div className="genre-stats">
    {[
      { label: "Genre",       count: genres.length,       icon: FaTag,        color: "#818cf8" },
      { label: "Tema",        count: themes.length,       icon: FaPalette,    color: "#c084fc" },
      { label: "Demografis",  count: demographics.length, icon: FaUsers,      color: "#34d399" },
      { label: "Total",       count: genres.length + themes.length + demographics.length,
                                                          icon: FaLayerGroup, color: "#fb923c" },
    ].map(({ label, count, icon: Icon, color }) => (
      <div key={label} className="genre-stat-item">
        <Icon className="genre-stat-item__icon" style={{ color }} aria-hidden="true" />
        <span className="genre-stat-item__count" style={{ color }}>{count}</span>
        <span className="genre-stat-item__label">{label}</span>
      </div>
    ))}
  </div>
));
StatsBar.displayName = "StatsBar";

/* ─────────────────────────────────────────────
   Groups Config
───────────────────────────────────────────── */
const GROUPS = [
  {
    key: "genres",
    title: "Genre",
    icon: FaTag,
    accent: {
      bg:     "rgba(99, 102, 241, 0.15)",
      border: "rgba(99, 102, 241, 0.35)",
      text:   "#818cf8",
    },
  },
  {
    key: "themes",
    title: "Tema",
    icon: FaPalette,
    accent: {
      bg:     "rgba(192, 132, 252, 0.15)",
      border: "rgba(192, 132, 252, 0.35)",
      text:   "#c084fc",
    },
  },
  {
    key: "demographics",
    title: "Demografis",
    icon: FaUsers,
    accent: {
      bg:     "rgba(52, 211, 153, 0.15)",
      border: "rgba(52, 211, 153, 0.35)",
      text:   "#34d399",
    },
  },
];

/* ─────────────────────────────────────────────
   Main Page
───────────────────────────────────────────── */
const GenresPage = () => {
  const { genres, themes, demographics, loading, error, retry } = useAnimeGenres();
  const [searchValue, setSearchValue] = useState("");

  const handleClear = useCallback(() => setSearchValue(""), []);

  const dataMap = { genres, themes, demographics };

  // Hitung total visible untuk search result text
  const totalVisible = GROUPS.reduce((acc, g) => {
    const items = dataMap[g.key] ?? [];
    return (
      acc +
      (searchValue
        ? items.filter((i) =>
            i.name.toLowerCase().includes(searchValue.toLowerCase())
          ).length
        : items.length)
    );
  }, 0);

  const totalAll = genres.length + themes.length + demographics.length;

  // Apakah semua grup kosong setelah search?
  const noResults =
    searchValue.trim() !== "" && !loading && !error && totalVisible === 0;

  return (
    <div className="genre-page">
      <div className="genre-page__container">

        {/* ── Page Header ── */}
        <header className="genre-page__header">
          <div className="genre-header__icon-wrap" aria-hidden="true">
            <FaTag />
          </div>
          <div>
            <h1 className="genre-header__title">Daftar Genre Anime</h1>
            <p className="genre-header__subtitle">
              Temukan anime favoritmu berdasarkan genre, tema, atau audiens
            </p>
          </div>
        </header>

        {/* ── Stats Bar ── */}
        {!loading && !error && (
          <StatsBar
            genres={genres}
            themes={themes}
            demographics={demographics}
          />
        )}

        {/* ── Search Bar ── */}
        {!loading && !error && (
          <GenreSearch
            value={searchValue}
            onChange={setSearchValue}
            onClear={handleClear}
            totalVisible={totalVisible}
            totalAll={totalAll}
          />
        )}

        {/* ── Content ── */}
        {loading ? (
          <FullPageSkeleton />
        ) : error ? (
          <GenreError message={error} onRetry={retry} />
        ) : noResults ? (
          <GenreNoResults query={searchValue} onClear={handleClear} />
        ) : (
          <div className="genre-page__body">
            {GROUPS.map((group) => (
              <GenreGroup
                key={group.key}
                title={group.title}
                icon={group.icon}
                items={dataMap[group.key] ?? []}
                accentColor={group.accent}
                searchValue={searchValue}
              />
            ))}
          </div>
        )}

        {/* ── Legend ── */}
        {!loading && !error && !searchValue && (
          <div className="genre-legend">
            <p className="genre-legend__title">
              <FaFire className="genre-legend__icon" aria-hidden="true" />
              Indikator Popularitas
            </p>
            <div className="genre-legend__chips">
              {[
                { label: "≥ 5000 anime", cls: "chip--fire",    text: "Sangat Populer" },
                { label: "≥ 2000 anime", cls: "chip--hot",     text: "Populer" },
                { label: "≥ 500 anime",  cls: "chip--warm",    text: "Umum" },
                { label: "≥ 100 anime",  cls: "chip--cool",    text: "Sedang" },
                { label: "< 100 anime",  cls: "chip--neutral", text: "Niche" },
              ].map(({ label, cls, text }) => (
                <div key={cls} className="genre-legend__item">
                  <span className={`genre-chip genre-chip--demo ${cls}`}>{text}</span>
                  <span className="genre-legend__item-label">{label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer attribution */}
        <p className="genre-attribution">
          Data disediakan oleh{" "}
          <a
            href="https://jikan.moe"
            target="_blank"
            rel="noopener noreferrer"
            className="genre-attribution__link"
          >
            Jikan API
          </a>{" "}
          • MyAnimeList
        </p>
      </div>
    </div>
  );
};

export default GenresPage;
