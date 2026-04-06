import { Link } from "react-router-dom";
import { FaTag, FaMask, FaUsers, FaExclamationTriangle } from "react-icons/fa";
import useAnimeGenres from "../hooks/useAnimeGenres";

/* ─── Small helpers ───────────────────────────────────────────── */

function encodeGenreName(name) {
  return encodeURIComponent(name.toLowerCase().replace(/\s+/g, "-"));
}

function GenreChip({ genre, color }) {
  return (
    <Link
      to={`/genre/${genre.mal_id}/${encodeGenreName(genre.name)}`}
      className="genre-chip"
      data-color={color}
      id={`genre-chip-${genre.mal_id}`}
    >
      <span className="genre-chip__name">{genre.name}</span>
      {genre.count > 0 && (
        <span className="genre-chip__count">
          {genre.count >= 1000
            ? `${(genre.count / 1000).toFixed(1)}k`
            : genre.count}
        </span>
      )}
    </Link>
  );
}

function SectionSkeleton({ count = 12 }) {
  return (
    <div className="genre-chips-group">
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className="genre-chip genre-chip--skeleton skeleton"
          style={{ width: `${60 + (i % 5) * 18}px` }}
        />
      ))}
    </div>
  );
}

/* ─── Main component ──────────────────────────────────────────── */

function GenrePage() {
  const { genres, themes, demographics, loading, error } = useAnimeGenres();

  return (
    <div className="genre-page">
      {/* ── Hero banner ─────────────────────────────────────────── */}
      <div className="genre-page__hero">
        <div className="genre-page__hero-glow" />
        <div className="genre-page__hero-content">
          <div className="genre-page__icon-wrap">
            <FaTag />
          </div>
          <div>
            <h1 className="genre-page__title">Daftar Genre</h1>
            <p className="genre-page__subtitle">
              Pilih genre favoritmu dan temukan anime yang tepat
            </p>
          </div>
        </div>
      </div>

      <div className="genre-page__container">
        {/* ── Error state ─────────────────────────────────────── */}
        {error && (
          <div className="genre-error">
            <FaExclamationTriangle className="genre-error__icon" />
            <p className="genre-error__text">{error}</p>
          </div>
        )}

        {/* ── Genre sections ──────────────────────────────────── */}
        <Section
          title="Genre"
          subtitle="Kategori utama berdasarkan jenis cerita"
          icon={<FaTag />}
          color="indigo"
          items={genres}
          loading={loading}
        />

        <Section
          title="Tema"
          subtitle="Berdasarkan tema dan latar cerita"
          icon={<FaMask />}
          color="purple"
          items={themes}
          loading={loading}
        />

        <Section
          title="Demografi"
          subtitle="Berdasarkan target audiens"
          icon={<FaUsers />}
          color="rose"
          items={demographics}
          loading={loading}
        />
      </div>
    </div>
  );
}

function Section({ title, subtitle, icon, color, items, loading }) {
  return (
    <section className={`genre-section genre-section--${color}`}>
      {/* header */}
      <div className="genre-section__header">
        <div className={`genre-section__icon-wrap genre-section__icon-wrap--${color}`}>
          {icon}
        </div>
        <div>
          <h2 className="genre-section__title">{title}</h2>
          <p className="genre-section__subtitle">{subtitle}</p>
        </div>
      </div>

      {/* chips */}
      {loading ? (
        <SectionSkeleton count={15} />
      ) : (
        <div className="genre-chips-group">
          {items.map((g) => (
            <GenreChip key={g.mal_id} genre={g} color={color} />
          ))}
          {items.length === 0 && (
            <p className="genre-empty-msg">Tidak ada data tersedia.</p>
          )}
        </div>
      )}
    </section>
  );
}

export default GenrePage;
