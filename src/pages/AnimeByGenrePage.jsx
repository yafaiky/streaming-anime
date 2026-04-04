import { useEffect, memo, useCallback } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaStar,
  FaPlay,
  FaTv,
  FaTag,
  FaRedo,
  FaChevronDown,
  FaLayerGroup,
} from "react-icons/fa";
import useAnimeByGenre from "../hooks/useAnimeByGenre";

/* ─────────────────────────────────────────────
   Skeleton Cards
───────────────────────────────────────────── */
const AnimeCardSkeleton = memo(() => (
  <div className="abg-card abg-card--skeleton animate-pulse" aria-hidden="true">
    <div className="skeleton abg-card__img-placeholder" />
    <div className="abg-card__body">
      <div className="skeleton skeleton--abg-title" />
      <div className="skeleton skeleton--abg-meta" style={{ marginTop: "0.5rem" }} />
    </div>
  </div>
));
AnimeCardSkeleton.displayName = "AnimeCardSkeleton";

const AnimeGridSkeleton = memo(() => (
  <div className="abg-grid" aria-busy="true" aria-label="Memuat anime…">
    {Array.from({ length: 18 }).map((_, i) => (
      <AnimeCardSkeleton key={i} />
    ))}
  </div>
));
AnimeGridSkeleton.displayName = "AnimeGridSkeleton";

/* ─────────────────────────────────────────────
   Anime Card
───────────────────────────────────────────── */
const AnimeCard = memo(({ anime, index }) => {
  const imageUrl =
    anime.images?.webp?.image_url ||
    anime.images?.jpg?.large_image_url ||
    anime.images?.jpg?.image_url;

  return (
    <Link
      to={`/anime/${anime.mal_id}`}
      className="abg-card"
      style={{ animationDelay: `${Math.min(index % 18, 17) * 0.04}s` }}
      aria-label={`Lihat detail ${anime.title}`}
    >
      {/* Hover glow */}
      <span className="abg-card__glow" aria-hidden="true" />

      {/* Cover Image */}
      <div className="abg-card__img-wrap">
        <img
          src={imageUrl}
          alt={anime.title}
          className="abg-card__img"
          loading="lazy"
        />

        {/* Badge Skor */}
        {anime.score && (
          <div className="abg-card__score">
            <FaStar className="abg-card__score-icon" aria-hidden="true" />
            {anime.score}
          </div>
        )}

        {/* Badge Type */}
        {anime.type && (
          <div className="abg-card__type-badge">{anime.type}</div>
        )}

        {/* Hover overlay */}
        <div className="abg-card__overlay">
          <span className="abg-card__cta">
            <FaPlay className="abg-card__cta-icon" aria-hidden="true" />
            Lihat Detail
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="abg-card__body">
        <h3 className="abg-card__title">{anime.title}</h3>

        <div className="abg-card__meta">
          {anime.episodes && (
            <span className="abg-meta-item">
              <FaTv className="abg-meta-item__icon" aria-hidden="true" />
              {anime.episodes} eps
            </span>
          )}
          {anime.year && (
            <span className="abg-meta-item">{anime.year}</span>
          )}
        </div>

        {/* Genres tags (maks 2) */}
        {anime.genres && anime.genres.length > 0 && (
          <div className="abg-card__genres">
            {anime.genres.slice(0, 2).map((g) => (
              <span key={g.mal_id} className="abg-genre-tag">{g.name}</span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
});
AnimeCard.displayName = "AnimeCard";

/* ─────────────────────────────────────────────
   Load More Button
───────────────────────────────────────────── */
const LoadMoreButton = memo(({ onClick, isLoading }) => (
  <div className="abg-load-more-wrap">
    <button
      id="btn-load-more-genre-anime"
      className="abg-load-more-btn"
      onClick={onClick}
      disabled={isLoading}
      aria-busy={isLoading}
    >
      {isLoading ? (
        <>
          <span className="abg-spinner" aria-hidden="true" />
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
const PageError = memo(({ message, onRetry }) => (
  <div className="abg-empty abg-empty--error" role="alert">
    <span className="abg-empty__icon" aria-hidden="true">⚠️</span>
    <p className="abg-empty__text abg-empty__text--error">{message}</p>
    <button id="btn-retry-genre-anime" className="abg-retry-btn" onClick={onRetry}>
      <FaRedo aria-hidden="true" />
      Coba Lagi
    </button>
  </div>
));
PageError.displayName = "PageError";

/* ─────────────────────────────────────────────
   Empty State
───────────────────────────────────────────── */
const PageEmpty = memo(({ genreName }) => (
  <div className="abg-empty">
    <span className="abg-empty__icon" aria-hidden="true">🎌</span>
    <p className="abg-empty__text">
      Tidak ada anime yang ditemukan untuk genre <strong>{genreName}</strong>.
    </p>
  </div>
));
PageEmpty.displayName = "PageEmpty";

/* ─────────────────────────────────────────────
   Main Page
───────────────────────────────────────────── */
const AnimeByGenrePage = () => {
  const { id, name } = useParams();
  const navigate = useNavigate();

  // Decode nama genre dari URL (e.g. "Slice%20of%20Life" → "Slice of Life")
  const genreName = name ? decodeURIComponent(name) : "Unknown";

  const {
    animeList,
    loading,
    loadingMore,
    error,
    hasNextPage,
    totalCount,
    fetchAnime,
    loadMore,
    retry,
  } = useAnimeByGenre(id);

  // Fetch page 1 saat pertama mount atau id berubah
  useEffect(() => {
    if (id) fetchAnime(1, false);
    return () => {};       // cleanup ditangani AbortController dalam hook
  }, [id, fetchAnime]);

  const handleBack = useCallback(() => navigate(-1), [navigate]);

  return (
    <div className="abg-page">
      <div className="abg-page__container">

        {/* ── Back Button ── */}
        <button
          id="btn-back-genre"
          className="abg-back-btn"
          onClick={handleBack}
          aria-label="Kembali ke halaman sebelumnya"
        >
          <FaArrowLeft aria-hidden="true" />
          Kembali
        </button>

        {/* ── Page Header ── */}
        <header className="abg-page__header">
          <div className="abg-header__icon-wrap" aria-hidden="true">
            <FaTag />
          </div>
          <div>
            <h1 className="abg-header__title">
              Anime Genre:{" "}
              <span className="abg-header__genre-name">{genreName}</span>
            </h1>
            <p className="abg-header__subtitle">
              {loading
                ? "Memuat data…"
                : totalCount > 0
                ? `${totalCount.toLocaleString("id-ID")} anime tersedia • Ditampilkan: ${animeList.length}`
                : "Daftar anime berdasarkan genre ini"}
            </p>
          </div>
        </header>

        {/* ── Breadcrumb ── */}
        <nav className="abg-breadcrumb" aria-label="Breadcrumb">
          <Link to="/genres" className="abg-breadcrumb__link">
            <FaLayerGroup aria-hidden="true" />
            Semua Genre
          </Link>
          <span className="abg-breadcrumb__sep" aria-hidden="true">/</span>
          <span className="abg-breadcrumb__current">{genreName}</span>
        </nav>

        {/* ── Content ── */}
        {loading ? (
          <AnimeGridSkeleton />
        ) : error ? (
          <PageError message={error} onRetry={retry} />
        ) : animeList.length === 0 ? (
          <PageEmpty genreName={genreName} />
        ) : (
          <>
            <div
              className="abg-grid"
              role="list"
              aria-label={`Daftar anime genre ${genreName}`}
            >
              {animeList.map((anime, index) => (
                <AnimeCard
                  key={`${anime.mal_id}-${index}`}
                  anime={anime}
                  index={index}
                />
              ))}
            </div>

            {/* Load More */}
            {hasNextPage && (
              <LoadMoreButton onClick={loadMore} isLoading={loadingMore} />
            )}

            {/* Semua telah dimuat */}
            {!hasNextPage && animeList.length > 0 && (
              <p className="abg-footer-note">
                ✓ Semua {animeList.length} anime telah dimuat
              </p>
            )}
          </>
        )}

        {/* Footer attribution */}
        <p className="abg-attribution">
          Data disediakan oleh{" "}
          <a
            href="https://jikan.moe"
            target="_blank"
            rel="noopener noreferrer"
            className="abg-attribution__link"
          >
            Jikan API
          </a>{" "}
          • MyAnimeList · <span className="abg-attribution__sfw">SFW content only</span>
        </p>
      </div>
    </div>
  );
};

export default AnimeByGenrePage;
