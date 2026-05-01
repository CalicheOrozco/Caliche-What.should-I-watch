import { IMG_BASE } from "../../services/tmdb";

export default function HistoryItem({ item, t, onSelect, onRemove }) {
  const date = new Date(item.date).toLocaleDateString();

  return (
    <button
      onClick={() => onSelect(item.id, item.mediaType || "movie")}
      className="w-full flex items-center gap-3 py-2.5 border-b border-zinc-800 last:border-0 hover:bg-zinc-800/50 rounded-lg px-1 transition-colors cursor-pointer text-left"
    >
      {/* Poster with delete overlay */}
      <div className="relative shrink-0">
        {item.poster ? (
          <img
            src={`${IMG_BASE.replace("w500", "w92")}${item.poster}`}
            alt={item.title}
            className="w-9 h-14 rounded-md object-cover"
          />
        ) : (
          <div className="w-9 h-14 rounded-md bg-zinc-700 flex items-center justify-center">
            <span className="text-xs text-zinc-500">?</span>
          </div>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(item.id); }}
          aria-label="Remove"
          className="absolute -top-1.5 -left-1.5 w-4 h-4 bg-zinc-900 border border-zinc-700 rounded-full flex items-center justify-center text-zinc-400 hover:text-rose-400 hover:border-rose-500 transition-colors cursor-pointer text-[10px] leading-none"
        >
          ×
        </button>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm text-zinc-200 font-medium truncate">{item.title}</p>
        <p className="text-xs text-zinc-500 mt-0.5">{date}</p>
      </div>

      <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 font-medium ${
        item.liked ? "bg-emerald-900/50 text-emerald-400" : "bg-rose-900/50 text-rose-400"
      }`}>
        {item.liked ? t("likedBadge") : t("rejectedBadge")}
      </span>
    </button>
  );
}
