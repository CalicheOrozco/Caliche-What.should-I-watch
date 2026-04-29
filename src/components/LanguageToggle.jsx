export default function LanguageToggle({ lang, onToggle }) {
  return (
    <div className="flex rounded-full border border-zinc-700 overflow-hidden">
      {["en", "es"].map((l) => (
        <button
          key={l}
          onClick={() => l !== lang && onToggle()}
          className={`px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
            l === lang
              ? "bg-violet-700 text-white"
              : "bg-zinc-800 text-zinc-400 hover:text-zinc-200"
          }`}
          aria-pressed={l === lang}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
