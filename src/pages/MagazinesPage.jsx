import { useState, useCallback, memo, useDeferredValue } from "react";
import {
  FaBook,
  FaSearch,
  FaTimes,
  FaExternalLinkAlt,
  FaRedo,
  FaChevronDown,
  FaLayerGroup,
} from "react-icons/fa";
import useMagazines from "../hooks/useMagazines";

/* ─────────────────────────────────────────────
   Constants
───────────────────────────────────────────── */

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

/* ─────────────────────────────────────────────
   Skeleton Loading
───────────────────────────────────────────── */
const MagazineCardSkeleton = memo(() => (
  <div className="mag-card mag-card--skeleton animate-pulse" aria-hidden="true">
    <div className="mag-card__icon-col">
      <div className="skeleton mag-card__icon-placeholder" />
    </div>
    <div className="mag-card__body">
      <div className="skeleton skeleton--mag-title" />
      <div className="skeleton skeleton--mag-count" style={{ marginTop: "0.5rem" }} />
    </div>
    <div className="skeleton skeleton--mag-btn" />
  </div>
));
MagazineCardSkeleton.displayName = "MagazineCardSkeleton";

const MagazineGridSkeleton = memo(() => (
  <div className="mag-grid" aria-busy="true" aria-label="Memuat majalah…">
    {Array.from({ length: 12 }).map((_, i) => (
      <MagazineCardSkeleton key={i} />
    ))}
  </div>
));
MagazineGridSkeleton.displayName = "MagazineGridSkeleton";

/* ─────────────────────────────────────────────
   Single Magazine Card
───────────────────────────────────────────── */
const MagazineCard = memo(({ item, index }) => {
  // Ambil inisial dari nama untuk avatar placeholder
  const initials = item.name
    ? item.name
        .split(" ")
        .slice(0, 2)
        .map((w) => w[0])
        .join("")
        .toUpperCase()
    : "?";

  return (
    <div
      className="mag-card"
      style={{ animationDelay: `${Math.min(index, 11) * 0.05}s` }}
    >
      {/* Hover glow */}
      <span className="mag-card__glow" aria-hidden="true" />

      {/* Avatar inisial */}
      <div className="mag-card__avatar" aria-hidden="true">
        {initials}
      </div>

      {/* Body */}
      <div className="mag-card__body">
        <h3 className="mag-card__name">{item.name || "—"}</h3>
        {item.count !== undefined && (
          <p className="mag-card__count">
            <FaLayerGroup className="mag-card__count-icon" aria-hidden="true" />
            <span>{item.count.toLocaleString("id-ID")} manga</span>
          </p>
        )}
      </div>

      {/* Link ke MAL */}
      {item.url && (
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mag-card__link"
          aria-label={`Lihat ${item.name} di MyAnimeList`}
          id={`btn-mag-link-${item.mal_id ?? index}`}
        >
          <FaExternalLinkAlt className="mag-card__link-icon" aria-hidden="true" />
        </a>
      )}
    </div>
  );
});
MagazineCard.displayName = "MagazineCard";

/* ─────────────────────────────────────────────
   Alphabet Filter Bar
───────────────────────────────────────────── */
const AlphabetFilter = memo(({ activeLetter, onSelect }) => (
  <nav
    className="alpha-filter"
    aria-label="Filter berdasarkan huruf"
    role="navigation"
  >
    {/* Tombol "All" */}
    <button
      id="btn-alpha-all"
      className={`alpha-btn ${activeLetter === "" ? "alpha-btn--active" : ""}`}
      onClick={() => onSelect("")}
      aria-pressed={activeLetter === ""}
    >
      Semua
    </button>

    {ALPHABET.map((letter) => (
      <button
        key={letter}
        id={`btn-alpha-${letter}`}
        className={`alpha-btn ${activeLetter === letter ? "alpha-btn--active" : ""}`}
        onClick={() => onSelect(letter)}
        aria-pressed={activeLetter === letter}
      >
        {letter}
      </button>
    ))}
  </nav>
));
AlphabetFilter.displayName = "AlphabetFilter";

/* ─────────────────────────────────────────────
   Search Bar
───────────────────────────────────────────── */
const SearchBar = memo(({ value, onChange, onClear }) => (
  <div className="mag-search-wrap">
    <FaSearch className="mag-search-icon" aria-hidden="true" />
    <input
      id="input-search-magazine"
      type="search"
      className="mag-search-input"
      placeholder="Cari nama majalah / penerbit…"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label="Cari majalah"
      autoComplete="off"
    />
    {value && (
      <button
        className="mag-search-clear"
        onClick={onClear}
        aria-label="Hapus pencarian"
        id="btn-clear-search"
      >
        <FaTimes />
      </button>
    )}
  </div>
));
SearchBar.displayName = "SearchBar";

/* ─────────────────────────────────────────────
   Load More Button
───────────────────────────────────────────── */
const LoadMoreButton = memo(({ onClick, isLoading }) => (
  <div className="mag-load-more-wrap">
    <button
      id="btn-load-more-magazines"
      className="mag-load-more-btn"
      onClick={onClick}
      disabled={isLoading}
      aria-busy={isLoading}
    >
      {isLoading ? (
        <>
          <span className="mag-spinner" aria-hidden="true" />
          Memuat…
        </>
      ) : (
        <>
          <FaChevronDown aria-hidden="true" />
          Muat Lebih Banyak
        </>
      )}
    </button>
  </div>
));
LoadMoreButton.displayName = "LoadMoreButton";

/* ─────────────────────────────────────────────
   Error State
───────────────────────────────────────────── */
const MagazinesError = memo(({ message, onRetry }) => (
  <div className="mag-empty mag-empty--error" role="alert">
    <span className="mag-empty__icon" aria-hidden="true">⚠️</span>
    <p className="mag-empty__text mag-empty__text--error">{message}</p>
    <button
      id="btn-retry-magazines"
      className="mag-retry-btn"
      onClick={onRetry}
    >
      <FaRedo aria-hidden="true" />
      Coba Lagi
    </button>
  </div>
));
MagazinesError.displayName = "MagazinesError";

/* ─────────────────────────────────────────────
   Empty State
───────────────────────────────────────────── */
const MagazinesEmpty = memo(({ isFiltered }) => (
  <div className="mag-empty">
    <span className="mag-empty__icon" aria-hidden="true">📚</span>
    <p className="mag-empty__text">
      {isFiltered
        ? "Tidak ada majalah yang cocok dengan filter ini."
        : "Belum ada data majalah tersedia."}
    </p>
  </div>
));
MagazinesEmpty.displayName = "MagazinesEmpty";

/* ─────────────────────────────────────────────
   Main Page Component
───────────────────────────────────────────── */
const MagazinesPage = () => {
  // ── Local UI state ──────────────────────────
  const [inputValue, setInputValue] = useState("");
  const [activeLetter, setActiveLetter] = useState("");

  /**
   * useDeferredValue pada searchQuery:
   * - Input tetap responsif (tidak ter-block saat fetch)
   * - Fetch hanya dipicu setelah React selesai render prioritas tinggi
   */
  const deferredQuery = useDeferredValue(inputValue);

  // ── Fetch data via custom hook ───────────────
  const {
    magazines,
    loading,
    loadingMore,
    error,
    hasNextPage,
    totalCount,
    loadMore,
    retry,
  } = useMagazines({ letter: activeLetter, q: deferredQuery });

  // ── Handlers ────────────────────────────────
  const handleLetterSelect = useCallback((letter) => {
    setActiveLetter(letter);
    setInputValue(""); // reset search saat pilih huruf
  }, []);

  const handleSearchChange = useCallback((val) => {
    setInputValue(val);
    setActiveLetter(""); // reset huruf saat search
  }, []);

  const handleClearSearch = useCallback(() => {
    setInputValue("");
  }, []);

  const isFiltered = activeLetter !== "" || deferredQuery !== "";

  // ── Render ──────────────────────────────────
  return (
    <div className="mag-page">
      <div className="mag-page__container">
        {/* ── Page Header ── */}
        <header className="mag-page__header">
          <div className="mag-header__icon-wrap" aria-hidden="true">
            <FaBook />
          </div>
          <div>
            <h1 className="mag-header__title">Majalah & Penerbit Manga</h1>
            <p className="mag-header__subtitle">
              {loading
                ? "Memuat data…"
                : totalCount > 0
                ? `${totalCount.toLocaleString("id-ID")} majalah tersedia`
                : "Penerbit & serialisasi manga dari MyAnimeList"}
            </p>
          </div>
        </header>

        {/* ── Controls: Search + Alphabet Filter ── */}
        <div className="mag-controls">
          <SearchBar
            value={inputValue}
            onChange={handleSearchChange}
            onClear={handleClearSearch}
          />
          <AlphabetFilter
            activeLetter={activeLetter}
            onSelect={handleLetterSelect}
          />
        </div>

        {/* ── Active Filter Badge ── */}
        {isFiltered && !loading && (
          <div className="mag-filter-badge">
            {activeLetter && (
              <span className="mag-badge">
                Huruf: <strong>{activeLetter}</strong>
                <button
                  className="mag-badge__remove"
                  onClick={() => setActiveLetter("")}
                  aria-label="Hapus filter huruf"
                >
                  <FaTimes />
                </button>
              </span>
            )}
            {deferredQuery && (
              <span className="mag-badge">
                Kata kunci: <strong>"{deferredQuery}"</strong>
                <button
                  className="mag-badge__remove"
                  onClick={handleClearSearch}
                  aria-label="Hapus kata kunci"
                >
                  <FaTimes />
                </button>
              </span>
            )}
            {magazines.length > 0 && (
              <span className="mag-result-count">
                {magazines.length} hasil
              </span>
            )}
          </div>
        )}

        {/* ── Content Area ── */}
        {loading ? (
          <MagazineGridSkeleton />
        ) : error ? (
          <MagazinesError message={error} onRetry={retry} />
        ) : magazines.length === 0 ? (
          <MagazinesEmpty isFiltered={isFiltered} />
        ) : (
          <>
            <div className="mag-grid" role="list" aria-label="Daftar majalah manga">
              {magazines.map((item, index) => (
                <MagazineCard
                  key={`${item.mal_id ?? item.name}-${index}`}
                  item={item}
                  index={index}
                />
              ))}
            </div>

            {/* Load More */}
            {hasNextPage && (
              <LoadMoreButton onClick={loadMore} isLoading={loadingMore} />
            )}

            {/* Footer note */}
            {!hasNextPage && magazines.length > 0 && (
              <p className="mag-footer-note">
                ✓ Semua {magazines.length} majalah telah dimuat
              </p>
            )}
          </>
        )}

        {/* Page footer attribution */}
        <p className="mag-attribution">
          Data disediakan oleh{" "}
          <a
            href="https://jikan.moe"
            target="_blank"
            rel="noopener noreferrer"
            className="mag-attribution__link"
          >
            Jikan API
          </a>{" "}
          • MyAnimeList
        </p>
      </div>
    </div>
  );
};

export default MagazinesPage;
