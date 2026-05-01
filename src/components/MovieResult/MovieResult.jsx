import { useState, useRef } from "react";
import MoviePoster from "./MoviePoster";
import MovieMeta from "./MovieMeta";
import MovieSynopsis from "./MovieSynopsis";
import TrailerEmbed from "./TrailerEmbed";
import WatchProviders from "./WatchProviders";
import MovieActions from "./MovieActions";

const SWIPE_THRESHOLD = 80;

export default function MovieResult({
  movie,
  trailer,
  providers,
  country,
  onCountryChange,
  onLike,
  onGetAnother,
  onChangePrefs,
  t,
}) {
  const [delta, setDelta] = useState(0);
  const startX = useRef(null);
  const startY = useRef(null);
  const isHorizontal = useRef(null);

  function handleTouchStart(e) {
    startX.current = e.touches[0].clientX;
    startY.current = e.touches[0].clientY;
    isHorizontal.current = null;
  }

  function handleTouchMove(e) {
    if (startX.current === null) return;
    const dx = e.touches[0].clientX - startX.current;
    const dy = e.touches[0].clientY - startY.current;

    // Decide axis on first meaningful move
    if (isHorizontal.current === null && (Math.abs(dx) > 5 || Math.abs(dy) > 5)) {
      isHorizontal.current = Math.abs(dx) > Math.abs(dy);
    }

    if (isHorizontal.current) setDelta(dx);
  }

  function handleTouchEnd() {
    if (isHorizontal.current) {
      if (delta > SWIPE_THRESHOLD) onLike();
      else if (delta < -SWIPE_THRESHOLD) onGetAnother();
    }
    setDelta(0);
    startX.current = null;
    startY.current = null;
    isHorizontal.current = null;
  }

  const swipingRight = delta > 30;
  const swipingLeft = delta < -30;

  return (
    <div
      className="w-full max-w-5xl mx-auto px-4 py-8 select-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Swipe overlays — full screen */}
      {swipingRight && (
        <div className="fixed inset-0 z-40 bg-emerald-500/10 flex items-center justify-center pointer-events-none">
          <span className="text-emerald-400 text-8xl font-bold drop-shadow-2xl">✓</span>
        </div>
      )}
      {swipingLeft && (
        <div className="fixed inset-0 z-40 bg-zinc-500/10 flex items-center justify-center pointer-events-none">
          <span className="text-zinc-300 text-8xl font-bold drop-shadow-2xl">↻</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8 items-start">
        {/* Poster */}
        <div className="md:sticky md:top-8 relative">
          <MoviePoster movie={movie} />
          <p className="text-center text-zinc-600 text-[11px] mt-2 md:hidden">
            ← skip &nbsp;·&nbsp; like →
          </p>
        </div>

        {/* Details */}
        <div className="flex flex-col gap-6">
          <MovieMeta movie={movie} t={t} />
          <MovieSynopsis movie={movie} t={t} />
          <WatchProviders
            providers={providers}
            country={country}
            onCountryChange={onCountryChange}
            t={t}
          />
          <TrailerEmbed videoKey={trailer} t={t} />
          <MovieActions
            onLike={onLike}
            onGetAnother={onGetAnother}
            onChangePrefs={onChangePrefs}
            t={t}
          />
        </div>
      </div>
    </div>
  );
}
