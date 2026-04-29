import { useState, useCallback } from "react";
import { T } from "./constants/translations";
import { useHistory } from "./hooks/useHistory";
import { useCountry } from "./hooks/useCountry";
import { useMovieFetcher } from "./hooks/useMovieFetcher";
import { usePlatforms } from "./hooks/usePlatforms";
import Questionnaire from "./components/Questionnaire/Questionnaire";
import MovieResult from "./components/MovieResult/MovieResult";
import History from "./components/History/History";
import LanguageToggle from "./components/LanguageToggle";
import PlatformSelector from "./components/PlatformSelector";
import SearchModal from "./components/Search/SearchModal";

function LoadingScreen({ t }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
      <div className="w-12 h-12 border-4 border-zinc-700 border-t-violet-500 rounded-full animate-spin" />
      <p className="text-zinc-400 text-lg">{t("loading")}</p>
    </div>
  );
}

function ErrorScreen({ t, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-4 text-center">
      <p className="text-zinc-400 text-lg">{t("errorMsg")}</p>
      <button
        onClick={onRetry}
        className="px-6 py-3 rounded-xl bg-violet-700 hover:bg-violet-600 text-white font-semibold transition-all cursor-pointer"
      >
        {t("retry")}
      </button>
    </div>
  );
}

export default function App() {
  const [lang, setLang] = useState("en");
  const [view, setView] = useState("questionnaire");
  const [answers, setAnswers] = useState({});

  const { history, historyIds, addToHistory, clearHistory } = useHistory();
  const { country, setCountry } = useCountry();
  const { selectedIds, togglePlatform, clearPlatforms, selectAllPlatforms } = usePlatforms();
  const { status, movie, trailer, providers, fetchMovie, fetchById } = useMovieFetcher();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const t = useCallback((key) => {
    const val = T[lang][key];
    return typeof val === "function" ? val : val ?? key;
  }, [lang]);

  function doFetch(finalAnswers) {
    return fetchMovie(finalAnswers, historyIds, lang, {
      selectedProviderIds: selectedIds,
      country,
    });
  }

  function handleAnswersComplete(finalAnswers) {
    setAnswers(finalAnswers);
    setView("loading");
    doFetch(finalAnswers).then(() => setView("result")).catch(() => setView("error"));
  }

  function handleLike() {
    if (movie) addToHistory(movie, true);
    setView("questionnaire");
  }

  function handleReject() {
    if (movie) addToHistory(movie, false);
    setView("questionnaire");
  }

  function handleGetAnother() {
    setView("loading");
    doFetch(answers).then(() => setView("result")).catch(() => setView("error"));
  }

  function handleRetry() {
    setView("loading");
    doFetch(answers).then(() => setView("result")).catch(() => setView("error"));
  }

  function handleSearchSelect(id, mediaType) {
    setIsSearchOpen(false);
    setView("loading");
    fetchById(id, mediaType, lang)
      .then(() => setView("result"))
      .catch(() => setView("error"));
  }

  function toggleLang() {
    setLang((l) => (l === "en" ? "es" : "en"));
  }

  const isLoading = status === "loading" || view === "loading";
  const isError = status === "error" || view === "error";

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Top bar */}
      <header className="sticky top-0 z-30 bg-zinc-950/80 backdrop-blur border-b border-zinc-800">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <button
            onClick={() => setView("questionnaire")}
            className="text-zinc-100 font-bold text-lg tracking-tight hover:text-violet-300 transition-colors cursor-pointer"
          >
            🎬 {t("appTitle")}
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSearchOpen(true)}
              aria-label={t("searchLabel")}
              className="flex items-center justify-center w-8 h-8 rounded-full border border-zinc-700 bg-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200 transition-all cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
            </button>
            <PlatformSelector
              country={country}
              onCountryChange={setCountry}
              selectedIds={selectedIds}
              onToggle={togglePlatform}
              onClear={clearPlatforms}
              onSelectAll={selectAllPlatforms}
              t={t}
            />
            <LanguageToggle lang={lang} onToggle={toggleLang} />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="pb-24">
        {isLoading ? (
          <LoadingScreen t={t} />
        ) : isError ? (
          <ErrorScreen t={t} onRetry={handleRetry} />
        ) : view === "questionnaire" ? (
          <>
            <div className="pt-12 pb-4 text-center px-4">
              <p className="text-zinc-500 text-sm">{t("appSubtitle")}</p>
            </div>
            <Questionnaire onComplete={handleAnswersComplete} t={t} />
          </>
        ) : view === "result" && movie ? (
          <MovieResult
            movie={movie}
            trailer={trailer}
            providers={providers}
            country={country}
            onCountryChange={setCountry}
            onLike={handleLike}
            onReject={handleReject}
            onGetAnother={handleGetAnother}
            t={t}
          />
        ) : null}
      </main>

      {/* History panel */}
      <History history={history} clearHistory={clearHistory} t={t} />

      {/* Search modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelect={handleSearchSelect}
        lang={lang}
        t={t}
      />
    </div>
  );
}
