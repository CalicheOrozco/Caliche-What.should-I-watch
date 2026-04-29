import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { getAvailableProviders, LOGO_BASE } from "../services/tmdb";
import { SUPPORTED_COUNTRIES } from "../hooks/useCountry";

const COUNTRY_FLAGS = { US: "🇺🇸", MX: "🇲🇽", CA: "🇨🇦", AU: "🇦🇺" };

export default function PlatformSelector({
  country,
  onCountryChange,
  selectedIds,
  onToggle,
  onClear,
  onSelectAll,
  t,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [platforms, setPlatforms] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;

    Promise.resolve()
      .then(() => {
        if (cancelled) return null;
        setLoading(true);
        return Promise.all([
          getAvailableProviders("movie", country),
          getAvailableProviders("tv", country),
        ]);
      })
      .then((result) => {
        if (!result || cancelled) return;
        const [movieData, tvData] = result;

        const priorityMap = new Map();
        [...(movieData.results || []), ...(tvData.results || [])].forEach((p) => {
          const existing = priorityMap.get(p.provider_id);
          if (!existing || p.display_priority < existing.display_priority) {
            priorityMap.set(p.provider_id, p);
          }
        });
        const top = [...priorityMap.values()]
          .sort((a, b) => a.display_priority - b.display_priority)
          .slice(0, 15);
        setPlatforms(top);
      })
      .catch(() => {
        if (cancelled) return;
        setPlatforms([]);
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isOpen, country]);

  const count = selectedIds.length;
  const flag = COUNTRY_FLAGS[country] || "🌎";

  return (
    <>
      {/* Trigger */}
      <button
        onClick={() => setIsOpen(true)}
        className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
          count > 0
            ? "border-violet-500 bg-violet-900/30 text-violet-300"
            : "border-zinc-700 bg-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200"
        }`}
      >
        <span>{flag}</span>
        <span className="text-zinc-600">·</span>
        <span>📡</span>
        {count > 0 && (
          <span className="bg-violet-600 text-white rounded-full px-1.5 py-0.5 text-[10px] leading-none">
            {count}
          </span>
        )}
      </button>

      {isOpen && createPortal(
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-9998 bg-black/80"
            onClick={() => setIsOpen(false)}
          />

          {/* Scroll container */}
          <div className="fixed inset-0 z-9999 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-6">
              <div className="relative w-full max-w-md bg-zinc-900 rounded-2xl border border-zinc-800 shadow-2xl">

                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
                  <div>
                    <h2 className="text-sm font-bold text-zinc-100">{t("platformsTitle")}</h2>
                    <p className="text-xs text-zinc-500 mt-0.5">{t("platformsSubtitle")}</p>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-zinc-500 hover:text-zinc-200 text-2xl leading-none cursor-pointer w-8 h-8 flex items-center justify-center rounded-lg hover:bg-zinc-800"
                  >
                    ×
                  </button>
                </div>

                {/* Country selector */}
                <div className="px-5 py-3 border-b border-zinc-800">
                  <p className="text-[11px] text-zinc-500 mb-2 uppercase tracking-widest font-medium">
                    {t("countryLabel")}
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {SUPPORTED_COUNTRIES.map((c) => (
                      <button
                        key={c}
                        onClick={() => onCountryChange(c)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          c === country
                            ? "bg-violet-700 text-white"
                            : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200"
                        }`}
                      >
                        {COUNTRY_FLAGS[c]} {c}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Active strip */}
                {count > 0 && (
                  <div className="px-5 py-2 bg-violet-950/40 border-b border-violet-900/30 flex items-center justify-between">
                    <span className="text-xs text-violet-400">{t("platformsActive")(count)}</span>
                    <button
                      onClick={onClear}
                      className="text-xs text-zinc-500 hover:text-rose-400 transition-colors cursor-pointer"
                    >
                      {t("platformsClear")}
                    </button>
                  </div>
                )}

                {/* Platform grid */}
                <div className="px-5 py-4">
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="w-7 h-7 border-2 border-zinc-700 border-t-violet-500 rounded-full animate-spin" />
                    </div>
                  ) : platforms.length === 0 ? (
                    <p className="text-zinc-500 text-sm text-center py-6">{t("platformsEmpty")}</p>
                  ) : (
                    <>
                      {selectedIds.length < platforms.length && (
                        <div className="flex justify-end mb-3">
                          <button
                            onClick={() => onSelectAll(platforms.map((p) => p.provider_id))}
                            className="text-xs text-zinc-500 hover:text-violet-400 transition-colors cursor-pointer"
                          >
                            {t("platformsSelectAll")}
                          </button>
                        </div>
                      )}
                    <div className="grid grid-cols-5 gap-2">
                      {platforms.map((p) => {
                        const active = selectedIds.includes(p.provider_id);
                        return (
                          <button
                            key={p.provider_id}
                            onClick={() => onToggle(p.provider_id)}
                            title={p.provider_name}
                            className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border transition-all cursor-pointer ${
                              active
                                ? "border-violet-500 bg-violet-900/30"
                                : "border-zinc-700 bg-zinc-800/60 hover:border-zinc-500 hover:bg-zinc-800"
                            }`}
                          >
                            <div className="relative">
                              <img
                                src={`${LOGO_BASE}${p.logo_path}`}
                                alt={p.provider_name}
                                className="w-10 h-10 rounded-lg object-cover"
                              />
                              {active && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-violet-600 rounded-full flex items-center justify-center text-white text-[9px] font-bold shadow">
                                  ✓
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-zinc-400 text-center leading-tight line-clamp-1 w-full">
                              {p.provider_name}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                    </>
                  )}
                </div>

                {/* Footer */}
                <div className="px-5 py-3 border-t border-zinc-800">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-full py-2.5 rounded-xl bg-violet-700 hover:bg-violet-600 text-white text-sm font-semibold transition-all cursor-pointer"
                  >
                    {t("platformsDone")}
                  </button>
                </div>

              </div>
            </div>
          </div>
        </>,
        document.body
      )}
    </>
  );
}
