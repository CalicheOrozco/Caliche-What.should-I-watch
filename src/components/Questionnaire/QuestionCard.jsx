export default function QuestionCard({ question, onAnswer, onSkip, t, stepLabel }) {
  return (
    <div className="w-full max-w-lg mx-auto px-4">
      <div className="text-xs text-zinc-500 mb-3 text-center tracking-widest uppercase">
        {stepLabel}
      </div>

      <h2 className="text-2xl font-semibold text-zinc-100 text-center mb-8">
        {t(question.labelKey)}
      </h2>

      <div className="flex flex-col gap-3">
        {question.options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onAnswer(opt.value)}
            className="w-full px-5 py-4 rounded-xl border border-zinc-700 bg-zinc-900 text-zinc-200 text-left text-base font-medium transition-all duration-150 hover:border-violet-500 hover:bg-violet-900/20 hover:text-violet-200 active:scale-[0.98] cursor-pointer"
          >
            {t(opt.labelKey)}
          </button>
        ))}
      </div>

      <button
        onClick={onSkip}
        className="mt-6 w-full text-sm text-zinc-500 hover:text-zinc-300 transition-colors py-2 cursor-pointer"
      >
        {t("skipQuestion")}
      </button>
    </div>
  );
}
