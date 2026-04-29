export default function MovieActions({ onLike, onReject, onGetAnother, t }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <button
        onClick={onLike}
        className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-semibold transition-all active:scale-[0.97] cursor-pointer"
      >
        <span>✓</span>
        {t("liked")}
      </button>
      <button
        onClick={onReject}
        className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-rose-800 hover:bg-rose-700 text-white font-semibold transition-all active:scale-[0.97] cursor-pointer"
      >
        <span>✕</span>
        {t("rejected")}
      </button>
      <button
        onClick={onGetAnother}
        className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-zinc-700 hover:bg-zinc-600 text-zinc-100 font-semibold transition-all active:scale-[0.97] cursor-pointer"
      >
        <span>↻</span>
        {t("getAnother")}
      </button>
    </div>
  );
}
