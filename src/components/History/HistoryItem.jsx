import { IMG_BASE } from "../../services/tmdb";

export default function HistoryItem({ item, t }) {
  const date = new Date(item.date).toLocaleDateString();

  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-zinc-800 last:border-0">
      {item.poster ? (
        <img
          src={`${IMG_BASE.replace("w500", "w92")}${item.poster}`}
          alt={item.title}
          className="w-9 h-14 rounded-md object-cover flex-shrink-0"
        />
      ) : (
        <div className="w-9 h-14 rounded-md bg-zinc-700 flex-shrink-0 flex items-center justify-center">
          <span className="text-xs text-zinc-500">?</span>
        </div>
      )}

      <div className="flex-1 min-w-0">
        <p className="text-sm text-zinc-200 font-medium truncate">{item.title}</p>
        <p className="text-xs text-zinc-500 mt-0.5">{date}</p>
      </div>

      <span
        className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 font-medium ${
          item.liked
            ? "bg-emerald-900/50 text-emerald-400"
            : "bg-rose-900/50 text-rose-400"
        }`}
      >
        {item.liked ? t("likedBadge") : t("rejectedBadge")}
      </span>
    </div>
  );
}
