export default function MovieActions({ onLike, onGetAnother, onChangePrefs, t }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-3">
        <button
          onClick={onLike}
          className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-semibold transition-all active:scale-[0.97] cursor-pointer"
        >
          <span>✓</span>
          {t("liked")}
        </button>
        <button
          onClick={onGetAnother}
          className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-zinc-700 hover:bg-zinc-600 text-zinc-100 font-semibold transition-all active:scale-[0.97] cursor-pointer"
        >
          <span>↻</span>
          {t("getAnother")}
        </button>
      </div>
      <button
        onClick={onChangePrefs}
        className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer py-1 text-center"
      >
        {t("changePrefs")}
      </button>
    </div>
  );
}
