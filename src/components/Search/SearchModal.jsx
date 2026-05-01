import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { searchMulti } from "../../services/tmdb";

const IMG_BASE = "https://image.tmdb.org/t/p/w92";

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

export default function SearchModal({ isOpen, onClose, onSelect, lang, t }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const debouncedQuery = useDebounce(query, 400);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setResults([]);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      return;
    }
    let cancelled = false;
    setLoading(true);
    searchMulti(debouncedQuery, lang)
      .then((data) => {
        if (cancelled) return;
        const filtered = (data.results || [])
          .filter((r) => r.media_type === "movie" || r.media_type === "tv")
          .slice(0, 10);
        setResults(filtered);
      })
      .catch(() => { if (!cancelled) setResults([]); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [debouncedQuery, lang]);

  if (!isOpen) return null;

  return createPortal(
    <>
      <div className="fixed inset-0 z-9998 bg-black/80" onClick={onClose} />
      <div className="fixed inset-0 z-9999 overflow-y-auto">
        <div className="flex min-h-full items-start justify-center p-4 pt-16">
          <div className="relative w-full max-w-lg bg-zinc-900 rounded-2xl border border-zinc-800 shadow-2xl">

            {/* Search input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800">
              <svg className="w-4 h-4 text-zinc-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("searchPlaceholder")}
                className="flex-1 bg-transparent text-zinc-100 placeholder-zinc-500 text-sm outline-none"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="text-zinc-500 hover:text-zinc-200 text-lg leading-none cursor-pointer"
                >
                  ×
                </button>
              )}
              <button
                onClick={onClose}
                className="text-zinc-500 hover:text-zinc-200 text-sm font-medium cursor-pointer ml-1 pl-3 border-l border-zinc-800"
              >
                {lang === "es" ? "Cerrar" : "Close"}
              </button>
            </div>

            {/* Results */}
            <div className="max-h-[60vh] overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center py-10">
                  <div className="w-6 h-6 border-2 border-zinc-700 border-t-violet-500 rounded-full animate-spin" />
                </div>
              ) : results.length === 0 && debouncedQuery.trim() ? (
                <p className="text-zinc-500 text-sm text-center py-10">{t("searchNoResults")}</p>
              ) : (
                <ul>
                  {results.map((item) => {
                    const isTV = item.media_type === "tv";
                    const title = isTV ? item.name : item.title;
                    const year = (isTV ? item.first_air_date : item.release_date)?.slice(0, 4);
                    const poster = item.poster_path ? `${IMG_BASE}${item.poster_path}` : null;

                    return (
                      <li key={item.id}>
                        <button
                          onClick={() => onSelect(item.id, item.media_type)}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-zinc-800 transition-colors cursor-pointer text-left"
                        >
                          {/* Poster */}
                          <div className="w-10 h-14 rounded-md overflow-hidden bg-zinc-800 shrink-0">
                            {poster ? (
                              <img src={poster} alt={title} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-zinc-600 text-lg">
                                {isTV ? "📺" : "🎬"}
                              </div>
                            )}
                          </div>
                          {/* Info */}
                          <div className="min-w-0 flex-1">
                            <p className="text-zinc-100 text-sm font-medium truncate">{title}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              {year && <span className="text-zinc-500 text-xs">{year}</span>}
                              <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${isTV ? "bg-blue-900/50 text-blue-400" : "bg-violet-900/50 text-violet-400"}`}>
                                {isTV ? "TV" : lang === "es" ? "Película" : "Movie"}
                              </span>
                              {item.vote_average > 0 && (
                                <span className="text-zinc-500 text-xs">⭐ {item.vote_average.toFixed(1)}</span>
                              )}
                            </div>
                          </div>
                          <svg className="w-4 h-4 text-zinc-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

          </div>
        </div>
      </div>
    </>,
    document.body
  );
}
