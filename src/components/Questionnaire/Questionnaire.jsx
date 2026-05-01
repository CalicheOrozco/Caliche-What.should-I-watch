import { useState, useRef, useEffect } from "react";
import { QUESTIONS } from "./questions";
import QuestionCard from "./QuestionCard";

export default function Questionnaire({ onComplete, t }) {
  const [mediaType, setMediaType] = useState("movie");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [navOpen, setNavOpen] = useState(false);
  const navRef = useRef(null);

  useEffect(() => {
    if (!navOpen) return;
    function handleClickOutside(e) {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setNavOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [navOpen]);

  function handleAnswer(value) {
    const question = QUESTIONS[step];
    const next = { ...answers, [question.id]: value };
    setAnswers(next);
    if (step + 1 >= QUESTIONS.length) {
      onComplete({ ...next, mediaType });
    } else {
      setStep((s) => s + 1);
    }
  }

  function handleSkip() {
    if (step + 1 >= QUESTIONS.length) {
      onComplete({ ...answers, mediaType });
    } else {
      setStep((s) => s + 1);
    }
  }

  const current = QUESTIONS[step];
  const stepLabel = t("stepOf")(step + 1, QUESTIONS.length);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] py-6">
      {/* Movie / Series toggle */}
      <div className="mb-6 flex rounded-2xl border border-zinc-700 overflow-hidden">
        {[
          { value: "movie", labelKey: "mediaMovie" },
          { value: "tv", labelKey: "mediaSeries" },
        ].map(({ value, labelKey }) => (
          <button
            key={value}
            onClick={() => setMediaType(value)}
            className={`px-8 py-3 text-sm font-semibold transition-all cursor-pointer ${
              mediaType === value
                ? "bg-violet-700 text-white"
                : "bg-zinc-900 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {value === "movie" ? "🎬" : "📺"} {t(labelKey)}
          </button>
        ))}
      </div>

      {/* Step counter + Jump-to dropdown */}
      <div ref={navRef} className="relative mb-8 w-full max-w-lg px-4 flex items-center justify-between">
        <span className="text-xs text-zinc-500 tracking-widest uppercase">{stepLabel}</span>
        <button
          onClick={() => setNavOpen((o) => !o)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-zinc-700 bg-zinc-800 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200 text-xs font-medium transition-all cursor-pointer"
        >
          Jump to filter
          <span className={`transition-transform duration-200 ${navOpen ? "rotate-180" : ""}`}>▾</span>
        </button>

        {navOpen && (
          <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 z-10 bg-zinc-900 border border-zinc-700 rounded-2xl p-3 shadow-xl w-72">
            <div className="flex flex-wrap gap-1.5">
              {QUESTIONS.map((q, i) => {
                const answered = answers[q.id] != null;
                const active = i === step;
                return (
                  <button
                    key={q.id}
                    onClick={() => { setStep(i); setNavOpen(false); }}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all cursor-pointer ${
                      active
                        ? "bg-violet-700 border-violet-500 text-white"
                        : answered
                        ? "bg-violet-900/30 border-violet-700 text-violet-400"
                        : "bg-zinc-800 border-zinc-700 text-zinc-500 hover:border-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    {answered && !active ? "✓ " : ""}{t(q.labelKey)}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <QuestionCard
        question={current}
        onAnswer={handleAnswer}
        onSkip={handleSkip}
        t={t}
        stepLabel={stepLabel}
      />

      <div className="flex flex-col items-center gap-3 mt-8">
        <button
          onClick={() => onComplete({ ...answers, mediaType })}
          className="px-8 py-3 rounded-xl bg-violet-700 hover:bg-violet-600 text-white text-sm font-semibold transition-all cursor-pointer"
        >
          {mediaType === "movie" ? "🎬" : "📺"} {t("searchNow")}
        </button>
        <button
          onClick={() => onComplete({ mediaType })}
          className="text-sm text-zinc-600 hover:text-zinc-400 transition-colors cursor-pointer"
        >
          ⚡ {t("skipAll")}
        </button>
      </div>
    </div>
  );
}
