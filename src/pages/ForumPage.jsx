import { useMemo, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  FaArrowLeft,
  FaComments,
  FaExternalLinkAlt,
  FaCalendarAlt,
  FaUser,
  FaRedo,
  FaRegSadCry,
} from "react-icons/fa";
import useAnimeForum from "../hooks/useAnimeForum";

// ─── Utility ─────────────────────────────────────────────────────────────────

/**
 * Format tanggal ISO ke string yang lebih manusiawi.
 * Contoh output: "02 Apr 2026 • 18:30"
 */
const formatDate = (isoString) => {
  if (!isoString) return "—";
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(isoString));
};

// ─── Sub-components ───────────────────────────────────────────────────────────

/**
 * Skeleton loader untuk satu kartu forum (optimasi: memo agar tidak re-render).
 */
const ForumCardSkeleton = () => (
  <div className="forum-card forum-card--skeleton animate-pulse">
    <div className="forum-card__header">
      <div className="skeleton skeleton--title" />
      <div className="skeleton skeleton--badge" />
    </div>
    <div className="skeleton skeleton--meta" />
  </div>
);

/**
 * Kartu untuk satu topik forum.
 * Dibungkus React.memo agar tidak re-render jika props tidak berubah.
 */
const ForumCard = ({ topic, index }) => {
  // useMemo: hitung format tanggal hanya saat `topic.date` berubah
  const formattedDate = useMemo(() => formatDate(topic.date), [topic.date]);

  return (
    <a
      href={topic.url}
      target="_blank"
      rel="noopener noreferrer"
      className="forum-card forum-card--link"
      style={{ animationDelay: `${index * 60}ms` }}
      aria-label={`Buka topik "${topic.title}" di MyAnimeList`}
    >
      {/* Glow accent */}
      <span className="forum-card__glow" aria-hidden="true" />

      <div className="forum-card__body">
        {/* Title */}
        <h3 className="forum-card__title">
          {topic.title}
        </h3>

        {/* Meta info */}
        <div className="forum-card__meta">
          <span className="forum-meta-item">
            <FaCalendarAlt className="forum-meta-item__icon" />
            <time dateTime={topic.date}>{formattedDate}</time>
          </span>

          {topic.author_username && (
            <span className="forum-meta-item">
              <FaUser className="forum-meta-item__icon" />
              {topic.author_username}
            </span>
          )}

          {topic.last_comment?.date && (
            <span className="forum-meta-item forum-meta-item--muted">
              Balasan terakhir: {formatDate(topic.last_comment.date)}
            </span>
          )}
        </div>
      </div>

      {/* CTA icon */}
      <FaExternalLinkAlt className="forum-card__link-icon" />
    </a>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

const ForumPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: topics, loading, error, refetch } = useAnimeForum(id);

  // useCallback agar referensi handler stabil, tidak buat ulang tiap render
  const handleBack = useCallback(() => navigate(-1), [navigate]);

  // Render: Loading state
  if (loading) {
    return (
      <div className="forum-page">
        <div className="forum-page__container">
          <button onClick={handleBack} className="forum-page__back-btn">
            <FaArrowLeft />
            Kembali
          </button>
          <div className="forum-header">
            <div className="forum-header__icon-wrap">
              <FaComments />
            </div>
            <div>
              <div className="skeleton skeleton--heading" />
              <div className="skeleton skeleton--subheading" />
            </div>
          </div>
          <div className="forum-list">
            {Array.from({ length: 6 }, (_, i) => (
              <ForumCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Render: Error state
  if (error) {
    return (
      <div className="forum-page">
        <div className="forum-page__container forum-page__container--centered">
          <div className="forum-empty">
            <FaRegSadCry className="forum-empty__icon forum-empty__icon--error" />
            <p className="forum-empty__text forum-empty__text--error">{error}</p>
            <button onClick={refetch} className="forum-page__retry-btn">
              <FaRedo />
              Coba Lagi
            </button>
            <button onClick={handleBack} className="forum-page__back-btn mt-4">
              <FaArrowLeft />
              Kembali
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render: Empty state
  if (topics.length === 0) {
    return (
      <div className="forum-page">
        <div className="forum-page__container forum-page__container--centered">
          <button onClick={handleBack} className="forum-page__back-btn">
            <FaArrowLeft />
            Kembali
          </button>
          <div className="forum-empty">
            <FaComments className="forum-empty__icon" />
            <p className="forum-empty__text">Belum ada topik diskusi untuk anime ini.</p>
          </div>
        </div>
      </div>
    );
  }

  // Render: Success state
  return (
    <div className="forum-page">
      <div className="forum-page__container">
        {/* Back button */}
        <button
          id="forum-back-btn"
          onClick={handleBack}
          className="forum-page__back-btn"
        >
          <FaArrowLeft />
          Kembali
        </button>

        {/* Header */}
        <header className="forum-header">
          <div className="forum-header__icon-wrap" aria-hidden="true">
            <FaComments />
          </div>
          <div>
            <h1 className="forum-header__title">Diskusi Forum</h1>
            <p className="forum-header__subtitle">
              {topics.length} topik ditemukan &bull; Anime #{id}
            </p>
          </div>
        </header>

        {/* Topic list */}
        <ul className="forum-list" role="list">
          {topics.map((topic, index) => (
            <li key={topic.mal_id ?? topic.title} role="listitem">
              <ForumCard topic={topic} index={index} />
            </li>
          ))}
        </ul>

        {/* Footer note */}
        <p className="forum-footer-note">
          Data disediakan oleh{" "}
          <a
            href="https://jikan.moe"
            target="_blank"
            rel="noopener noreferrer"
            className="forum-footer-note__link"
          >
            Jikan API
          </a>{" "}
          &bull; MyAnimeList
        </p>
      </div>
    </div>
  );
};

export default ForumPage;
