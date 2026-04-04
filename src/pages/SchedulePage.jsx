import { useEffect, memo, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  FaCalendarAlt,
  FaStar,
  FaPlay,
  FaRedo,
  FaChevronRight,
  FaTv,
} from "react-icons/fa";
import useAnimeSchedule from "../hooks/useAnimeSchedule";

/* ─────────────────────────────────────────────
   Constants
───────────────────────────────────────────── */

/**
 * Daftar hari: label UI (Indonesia) + value API (English).
 * Auto-select hari berdasarkan Date.getDay() (0 = Minggu, 1 = Senin, …).
 * Index sesuai urutan hari dalam array ini agar mudah di-lookup.
 */
const DAYS = [
  { label: "Senin",  value: "monday"    },
  { label: "Selasa", value: "tuesday"   },
  { label: "Rabu",   value: "wednesday" },
  { label: "Kamis",  value: "thursday"  },
  { label: "Jumat",  value: "friday"    },
  { label: "Sabtu",  value: "saturday"  },
  { label: "Minggu", value: "sunday"    },
];

/**
 * Dapatkan value API untuk hari ini.
 * Date.getDay() → 0 (Minggu) … 6 (Sabtu)
 * DAYS array     → index 0 = Senin … 6 = Minggu
 * Konversi: (getDay() + 6) % 7  →  Senin=0, …, Minggu=6
 */
const getTodayValue = () => {
  const jsDay = new Date().getDay(); // 0=Sun … 6=Sat
  const idx   = (jsDay + 6) % 7;    // 0=Mon … 6=Sun
  return DAYS[idx].value;
};

/* ─────────────────────────────────────────────
   Skeleton Cards
───────────────────────────────────────────── */
const ScheduleCardSkeleton = memo(() => (
  <div className="sched-card sched-card--skeleton animate-pulse" aria-hidden="true">
    <div className="skeleton sched-card__img-placeholder" />
    <div className="sched-card__body">
      <div className="skeleton skeleton--sched-title" />
      <div className="skeleton skeleton--sched-meta" style={{ marginTop: "0.5rem" }} />
    </div>
  </div>
));
ScheduleCardSkeleton.displayName = "ScheduleCardSkeleton";

const ScheduleGridSkeleton = memo(() => (
  <div className="sched-grid" aria-busy="true">
    {Array.from({ length: 12 }).map((_, i) => (
      <ScheduleCardSkeleton key={i} />
    ))}
  </div>
));
ScheduleGridSkeleton.displayName = "ScheduleGridSkeleton";

/* ─────────────────────────────────────────────
   Schedule Card
───────────────────────────────────────────── */
const ScheduleCard = memo(({ anime, index }) => {
  const imageUrl =
    anime.images?.webp?.image_url ||
    anime.images?.jpg?.large_image_url ||
    anime.images?.jpg?.image_url;

  return (
    <Link
      to={`/anime/${anime.mal_id}`}
      className="sched-card"
      style={{ animationDelay: `${Math.min(index, 11) * 0.05}s` }}
      aria-label={`Lihat detail ${anime.title}`}
    >
      {/* Hover glow */}
      <span className="sched-card__glow" aria-hidden="true" />

      {/* Cover image */}
      <div className="sched-card__img-wrap">
        <img
          src={imageUrl}
          alt={anime.title}
          className="sched-card__img"
          loading="lazy"
        />

        {/* Score badge */}
        {anime.score && (
          <div className="sched-card__score">
            <FaStar className="sched-card__score-icon" aria-hidden="true" />
            {anime.score}
          </div>
        )}

        {/* Type badge */}
        {anime.type && (
          <div className="sched-card__type">
            {anime.type}
          </div>
        )}

        {/* Overlay CTA */}
        <div className="sched-card__overlay">
          <span className="sched-card__cta">
            <FaPlay className="sched-card__cta-icon" aria-hidden="true" />
            Lihat Detail
          </span>
        </div>
      </div>

      {/* Card info */}
      <div className="sched-card__body">
        <h3 className="sched-card__title">{anime.title}</h3>

        <div className="sched-card__meta">
          {anime.episodes && (
            <span className="sched-meta-item">
              <FaTv className="sched-meta-item__icon" aria-hidden="true" />
              {anime.episodes} eps
            </span>
          )}
          {anime.broadcast?.string && (
            <span className="sched-meta-item sched-meta-item--broadcast">
              {anime.broadcast.string}
            </span>
          )}
        </div>

        {/* Genres */}
        {anime.genres && anime.genres.length > 0 && (
          <div className="sched-card__genres">
            {anime.genres.slice(0, 3).map((g) => (
              <span key={g.mal_id} className="sched-genre-tag">
                {g.name}
              </span>
            ))}
          </div>
        )}
      </div>

      <FaChevronRight className="sched-card__arrow" aria-hidden="true" />
    </Link>
  );
});
ScheduleCard.displayName = "ScheduleCard";

/* ─────────────────────────────────────────────
   Day Tab Bar
───────────────────────────────────────────── */
const DayTabs = memo(({ activeDay, todayValue, onSelect }) => (
  <nav className="sched-tabs" role="tablist" aria-label="Pilih hari jadwal">
    {DAYS.map((day) => {
      const isActive  = activeDay === day.value;
      const isToday   = todayValue === day.value;

      return (
        <button
          key={day.value}
          id={`tab-${day.value}`}
          role="tab"
          aria-selected={isActive}
          className={[
            "sched-tab",
            isActive ? "sched-tab--active" : "",
            isToday  ? "sched-tab--today"  : "",
          ].join(" ").trim()}
          onClick={() => onSelect(day.value)}
        >
          {day.label}
          {isToday && (
            <span className="sched-tab__today-dot" aria-label="Hari ini" />
          )}
        </button>
      );
    })}
  </nav>
));
DayTabs.displayName = "DayTabs";

/* ─────────────────────────────────────────────
   Error State
───────────────────────────────────────────── */
const ScheduleError = memo(({ message, onRetry }) => (
  <div className="sched-empty sched-empty--error" role="alert">
    <span className="sched-empty__icon" aria-hidden="true">⚠️</span>
    <p className="sched-empty__text sched-empty__text--error">{message}</p>
    <button id="btn-retry-schedule" className="sched-retry-btn" onClick={onRetry}>
      <FaRedo aria-hidden="true" />
      Coba Lagi
    </button>
  </div>
));
ScheduleError.displayName = "ScheduleError";

/* ─────────────────────────────────────────────
   Empty State
───────────────────────────────────────────── */
const ScheduleEmpty = memo(({ day }) => {
  const label = DAYS.find((d) => d.value === day)?.label ?? day;
  return (
    <div className="sched-empty">
      <span className="sched-empty__icon" aria-hidden="true">📋</span>
      <p className="sched-empty__text">
        Tidak ada jadwal anime yang tersedia untuk hari {label}.
      </p>
    </div>
  );
});
ScheduleEmpty.displayName = "ScheduleEmpty";

/* ─────────────────────────────────────────────
   Main Page
───────────────────────────────────────────── */
const SchedulePage = () => {
  const { schedule, loading, error, activeDay, fetchSchedule, retry } =
    useAnimeSchedule();

  // Hitung hari ini sekali (tidak berubah selama session)
  const todayValue = getTodayValue();

  // Auto-select hari ini saat pertama mount
  useEffect(() => {
    fetchSchedule(todayValue);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Stable handler untuk tab click
  const handleTabSelect = useCallback(
    (day) => fetchSchedule(day),
    [fetchSchedule]
  );

  const handleRetry = useCallback(
    () => retry(activeDay),
    [retry, activeDay]
  );

  // Label hari aktif (untuk heading)
  const activeDayLabel = DAYS.find((d) => d.value === activeDay)?.label ?? "";
  const isToday = activeDay === todayValue;

  return (
    <div className="sched-page">
      <div className="sched-page__container">

        {/* ── Page Header ── */}
        <header className="sched-page__header">
          <div className="sched-header__icon-wrap" aria-hidden="true">
            <FaCalendarAlt />
          </div>
          <div>
            <h1 className="sched-header__title">Jadwal Tayang Anime</h1>
            <p className="sched-header__subtitle">
              Jadwal rilis mingguan anime season ini
            </p>
          </div>
        </header>

        {/* ── Day Tab Bar ── */}
        <DayTabs
          activeDay={activeDay}
          todayValue={todayValue}
          onSelect={handleTabSelect}
        />

        {/* ── Active day headline ── */}
        {activeDayLabel && (
          <div className="sched-day-headline">
            <h2 className="sched-day-headline__text">
              {activeDayLabel}
              {isToday && (
                <span className="sched-day-headline__badge">Hari Ini</span>
              )}
            </h2>
            {!loading && !error && schedule.length > 0 && (
              <span className="sched-day-headline__count">
                {schedule.length} anime
              </span>
            )}
          </div>
        )}

        {/* ── Content Area ── */}
        {loading ? (
          <ScheduleGridSkeleton />
        ) : error ? (
          <ScheduleError message={error} onRetry={handleRetry} />
        ) : schedule.length === 0 ? (
          <ScheduleEmpty day={activeDay} />
        ) : (
          <div
            className="sched-grid"
            role="list"
            aria-label={`Jadwal anime hari ${activeDayLabel}`}
          >
            {schedule.map((anime, index) => (
              <ScheduleCard
                key={anime.mal_id ?? index}
                anime={anime}
                index={index}
              />
            ))}
          </div>
        )}

        {/* Footer attribution */}
        <p className="sched-attribution">
          Data disediakan oleh{" "}
          <a
            href="https://jikan.moe"
            target="_blank"
            rel="noopener noreferrer"
            className="sched-attribution__link"
          >
            Jikan API
          </a>{" "}
          • MyAnimeList · {" "}
          <span className="sched-attribution__note">SFW content only</span>
        </p>
      </div>
    </div>
  );
};

export default SchedulePage;
