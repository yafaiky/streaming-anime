import { useParams, Link } from "react-router-dom";
import { FaArrowLeft, FaStar, FaFilm, FaChevronDown, FaExclamationTriangle, FaTag } from "react-icons/fa";
import AnimeCard from "../components/AnimeCard";
import useAnimeByGenre from "../hooks/useAnimeByGenre";

/* ─── Decode URL-safe genre name to display name ─────────────── */
function decodeName(raw) {
  return decodeURIComponent(raw)
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/* ─── Skeleton grid ──────────────────────────────────────────── */
function SkeletonGrid({ count = 12 }) {
  return (
    <div className="anime-grid">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="anime-card">
          <div
            className="image-container skeleton"
            style={{ aspectRatio: "3/4", borderRadius: "16px" }}
          />
          <div className="mt-3 px-1 flex flex-col gap-2">
            <div className="skeleton" style={{ height: "14px", width: "80%", borderRadius: "6px" }} />
            <div className="skeleton" style={{ height: "12px", width: "50%", borderRadius: "6px" }} />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Main component ─────────────────────────────────────────── */
function AnimeByGenre() {
  const { id, name } = useParams();
  const displayName = decodeName(name ?? "");

  const { anime, loading, loadingMore, error, hasNextPage, loadMore } =
    useAnimeByGenre(id);

  return (
    <div className="abg-page">
      {/* ── Hero banner ─────────────────────────────────────────── */}
      <div className="abg-hero">
        <div className="abg-hero__glow" />
        <div className="abg-hero__content">
          {/* Back button */}
          <Link to="/genre" className="abg-back-btn" id="back-to-genres-btn">
            <FaArrowLeft />
            <span>Semua Genre</span>
          </Link>

          <div className="abg-hero__meta">
            <div className="abg-hero__icon-wrap">
              <FaTag />
            </div>
            <div>
              <h1 className="abg-hero__title">
                Anime dengan Genre:{" "}
                <span className="abg-hero__title-accent">{displayName}</span>
              </h1>
              <p className="abg-hero__subtitle">
                {loading
                  ? "Memuat data…"
                  : `${anime.length} anime ditemukan`}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="abg-container">
        {/* ── Error state ─────────────────────────────────────── */}
        {error && (
          <div className="abg-error">
            <FaExclamationTriangle className="abg-error__icon" />
            <p className="abg-error__text">{error}</p>
          </div>
        )}

        {/* ── Initial Loading skeleton ─────────────────────────── */}
        {loading && !error && <SkeletonGrid count={12} />}

        {/* ── Results grid ─────────────────────────────────────── */}
        {!loading && !error && anime.length === 0 && (
          <div className="abg-empty">
            <FaFilm className="abg-empty__icon" />
            <p className="abg-empty__text">
              Tidak ada anime ditemukan untuk genre ini.
            </p>
          </div>
        )}

        {anime.length > 0 && (
          <>
            <div className="anime-grid">
              {anime.map((item) => (
                <AnimeCard key={`${item.mal_id}-${Math.random()}`} anime={item} />
              ))}
            </div>

            {/* ── Load More ─────────────────────────────────────── */}
            <div className="abg-load-more-wrap">
              {hasNextPage ? (
                <button
                  id="load-more-anime-btn"
                  className="abg-load-more-btn"
                  onClick={loadMore}
                  disabled={loadingMore}
                >
                  {loadingMore ? (
                    <>
                      <span className="abg-spinner" aria-hidden="true" />
                      <span>Memuat…</span>
                    </>
                  ) : (
                    <>
                      <FaChevronDown />
                      <span>Muat Lebih Banyak</span>
                    </>
                  )}
                </button>
              ) : (
                anime.length > 0 && (
                  <p className="abg-end-note">
                    ✓ Semua anime sudah ditampilkan
                  </p>
                )
              )}
            </div>
          </>
        )}

        {/* Skeleton rows while loading more */}
        {loadingMore && (
          <div className="anime-grid" style={{ marginTop: "1.5rem" }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="anime-card">
                <div
                  className="image-container skeleton"
                  style={{ aspectRatio: "3/4", borderRadius: "16px" }}
                />
                <div className="mt-3 px-1 flex flex-col gap-2">
                  <div className="skeleton" style={{ height: "14px", width: "80%", borderRadius: "6px" }} />
                  <div className="skeleton" style={{ height: "12px", width: "50%", borderRadius: "6px" }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AnimeByGenre;
