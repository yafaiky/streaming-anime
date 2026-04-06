import { memo, useCallback } from "react";
import { FaNewspaper, FaCalendarAlt, FaUser, FaExternalLinkAlt, FaRedo, FaChevronDown } from "react-icons/fa";
import useAnimeNews from "../hooks/useAnimeNews";

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */

/**
 * Format tanggal ISO ke format yang mudah dibaca.
 * Mengembalikan string kosong jika `dateStr` tidak valid.
 */
const formatDate = (dateStr) => {
  if (!dateStr) return "";
  try {
    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(new Date(dateStr));
  } catch {
    return dateStr;
  }
};

/* ─────────────────────────────────────────────
   Skeleton Loading (5 placeholder cards)
───────────────────────────────────────────── */
const NewsSkeleton = memo(() => (
  <ul className="anime-news__list" aria-busy="true" aria-label="Memuat berita…">
    {Array.from({ length: 5 }).map((_, i) => (
      <li key={i} className="news-card news-card--skeleton">
        <div className="news-card__body">
          <div className="skeleton skeleton--news-title" />
          <div className="skeleton skeleton--news-meta" style={{ marginTop: "0.5rem" }} />
        </div>
        <div className="skeleton skeleton--news-arrow" />
      </li>
    ))}
  </ul>
));
NewsSkeleton.displayName = "NewsSkeleton";

/* ─────────────────────────────────────────────
   Single News Card — memoised untuk cegah re-render
   saat Load More hanya append item baru
───────────────────────────────────────────── */
const NewsCard = memo(({ item, index }) => {
  const animDelay = `${Math.min(index, 9) * 0.06}s`;

  return (
    <li className="news-card" style={{ animationDelay: animDelay }}>
      {/* Hover glow */}
      <span className="news-card__glow" aria-hidden="true" />

      <div className="news-card__body">
        {/* Judul berita */}
        <h3 className="news-card__title">{item.title || "Judul tidak tersedia"}</h3>

        {/* Meta: tanggal & penulis */}
        <div className="news-card__meta">
          {item.date && (
            <span className="news-meta-item">
              <FaCalendarAlt className="news-meta-item__icon" aria-hidden="true" />
              {formatDate(item.date)}
            </span>
          )}
          {item.author_username && (
            <span className="news-meta-item">
              <FaUser className="news-meta-item__icon" aria-hidden="true" />
              {item.author_username}
            </span>
          )}
          {item.comments !== undefined && (
            <span className="news-meta-item news-meta-item--comment">
              {item.comments} komentar
            </span>
          )}
        </div>

        {/* Excerpt (jika ada) */}
        {item.excerpt && (
          <p className="news-card__excerpt">{item.excerpt}</p>
        )}
      </div>

      {/* Link ke sumber berita */}
      {item.url && (
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="news-card__link"
          aria-label={`Baca berita: ${item.title}`}
        >
          <FaExternalLinkAlt className="news-card__link-icon" aria-hidden="true" />
        </a>
      )}
    </li>
  );
});
NewsCard.displayName = "NewsCard";

/* ─────────────────────────────────────────────
   Error State
───────────────────────────────────────────── */
const NewsError = memo(({ message, onRetry }) => (
  <div className="news-empty news-empty--error" role="alert">
    <span className="news-empty__icon news-empty__icon--error" aria-hidden="true">⚠️</span>
    <p className="news-empty__text news-empty__text--error">{message}</p>
    <button className="news__retry-btn" onClick={onRetry} id="btn-retry-news">
      <FaRedo className="text-sm" aria-hidden="true" />
      Coba Lagi
    </button>
  </div>
));
NewsError.displayName = "NewsError";

/* ─────────────────────────────────────────────
   Empty State
───────────────────────────────────────────── */
const NewsEmpty = memo(() => (
  <div className="news-empty">
    <span className="news-empty__icon" aria-hidden="true">📰</span>
    <p className="news-empty__text">Belum ada berita untuk anime ini.</p>
  </div>
));
NewsEmpty.displayName = "NewsEmpty";

/* ─────────────────────────────────────────────
   Load More Button
───────────────────────────────────────────── */
const LoadMoreButton = memo(({ onClick, isLoading }) => (
  <div className="news__load-more-wrap">
    <button
      id="btn-load-more-news"
      className="news__load-more-btn"
      onClick={onClick}
      disabled={isLoading}
      aria-busy={isLoading}
    >
      {isLoading ? (
        <>
          <span className="news__spinner" aria-hidden="true" />
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
   Main AnimeNews Component
───────────────────────────────────────────── */
/**
 * Komponen section Anime News untuk ditempel di halaman detail anime.
 *
 * Props:
 * @param {string|number} animeId - ID anime (bisa diteruskan dari parent atau diambil via useParams di parent)
 *
 * Arsitektur:
 * - Logika fetching/paginasi didelegasikan sepenuhnya ke useAnimeNews (separation of concerns)
 * - Sub-komponen dimemo agar tidak ikut re-render saat hanya loadingMore berubah
 */
const AnimeNews = ({ animeId }) => {
  const {
    news,
    loading,
    loadingMore,
    error,
    hasNextPage,
    loadMore,
    retry,
  } = useAnimeNews(animeId);

  // Stable callback — tidak perlu useCallback di sini karena loadMore sudah stabil dari hook
  const handleLoadMore = loadMore;
  const handleRetry = retry;

  return (
    <section className="anime-news" aria-label="Anime News">
      {/* ── Section Header ── */}
      <header className="anime-news__header">
        <div className="anime-news__icon-wrap" aria-hidden="true">
          <FaNewspaper />
        </div>
        <div>
          <h2 className="anime-news__title">Anime News</h2>
          <p className="anime-news__subtitle">Berita terbaru seputar anime ini</p>
        </div>
      </header>

      {/* ── Content Area ── */}
      {loading ? (
        <NewsSkeleton />
      ) : error ? (
        <NewsError message={error} onRetry={handleRetry} />
      ) : news.length === 0 ? (
        <NewsEmpty />
      ) : (
        <>
          <ul className="anime-news__list" role="list" aria-label="Daftar berita anime">
            {news.map((item, index) => (
              <NewsCard key={`${item.mal_id ?? index}-${index}`} item={item} index={index} />
            ))}
          </ul>

          {/* ── Load More / Pagination ── */}
          {hasNextPage && (
            <LoadMoreButton onClick={handleLoadMore} isLoading={loadingMore} />
          )}

          {/* Footer note */}
          {!hasNextPage && news.length > 0 && (
            <p className="news-footer-note">
              ✓ Semua berita telah dimuat ({news.length} artikel)
            </p>
          )}
        </>
      )}
    </section>
  );
};

export default AnimeNews;
