import { useState } from "react";
import { QUESTIONS } from "./questions";
import QuestionCard from "./QuestionCard";

export default function Questionnaire({ onComplete, t }) {
  const [mediaType, setMediaType] = useState("movie");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});

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
    <div className="flex flex-col items-center justify-center min-h-[60vh] py-10">
      {/* Movie / Series toggle */}
      <div className="mb-8 flex rounded-2xl border border-zinc-700 overflow-hidden">
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

      {/* Skip all */}
      <div className="mb-10 text-center">
        <button
          onClick={() => onComplete({ mediaType })}
          className="text-sm text-zinc-500 hover:text-violet-400 transition-colors border border-zinc-700 rounded-full px-4 py-1.5 hover:border-violet-500 cursor-pointer"
        >
          ⚡ {t("skipAll")}
        </button>
      </div>

      <QuestionCard
        question={current}
        onAnswer={handleAnswer}
        onSkip={handleSkip}
        t={t}
        stepLabel={stepLabel}
      />

      <div className="flex gap-2 mt-10">
        {QUESTIONS.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === step
                ? "w-6 bg-violet-500"
                : i < step
                ? "w-3 bg-violet-700"
                : "w-3 bg-zinc-700"
            }`}
          />
        ))}
      </div>

      {step > 0 && (
        <button
          onClick={() => onComplete({ ...answers, mediaType })}
          className="mt-6 px-5 py-2.5 rounded-xl bg-violet-700 hover:bg-violet-600 text-white text-sm font-semibold transition-all cursor-pointer"
        >
          {mediaType === "movie" ? "🎬" : "📺"} {t("searchNow")}
        </button>
      )}
    </div>
  );
}
