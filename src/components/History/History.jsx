import { useState } from "react";
import HistoryItem from "./HistoryItem";

export default function History({ history, clearHistory, onSelect, onRemove, t }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Desktop: fixed right sidebar toggle button */}
      <button
        onClick={() => setIsOpen((o) => !o)}
        className="fixed right-0 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-center gap-1 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-l-xl px-2 py-4 transition-colors cursor-pointer"
        aria-label={t("history")}
      >
        <span className="text-zinc-400 text-xs writing-mode-vertical" style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}>
          {t("history")}
        </span>
        {history.length > 0 && (
          <span className="bg-violet-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
            {history.length > 99 ? "99+" : history.length}
          </span>
        )}
      </button>

      {/* Desktop sidebar panel */}
      <div
        className={`fixed right-0 top-0 h-full w-72 bg-zinc-900 border-l border-zinc-800 z-50 flex-col hidden md:flex transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-zinc-800">
          <div>
            <h2 className="text-sm font-semibold text-zinc-100">{t("history")}</h2>
            <p className="text-xs text-zinc-500">{t("historyCount")(history.length)}</p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-zinc-500 hover:text-zinc-300 text-xl leading-none cursor-pointer"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-2">
          {history.length === 0 ? (
            <p className="text-zinc-500 text-sm py-6 text-center">{t("historyEmpty")}</p>
          ) : (
            history.map((item) => <HistoryItem key={item.id} item={item} t={t} onSelect={onSelect} onRemove={onRemove} />)
          )}
        </div>

        {history.length > 0 && (
          <div className="px-4 py-3 border-t border-zinc-800">
            <button
              onClick={clearHistory}
              className="w-full text-xs text-rose-400 hover:text-rose-300 transition-colors py-2 cursor-pointer"
            >
              {t("clearHistory")}
            </button>
          </div>
        )}
      </div>

      {/* Overlay for desktop sidebar */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 hidden md:block"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile: bottom drawer toggle */}
      <button
        onClick={() => setIsOpen((o) => !o)}
        className="fixed bottom-4 right-4 z-40 flex md:hidden items-center gap-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-full px-4 py-2.5 shadow-lg transition-colors cursor-pointer"
        aria-label={t("history")}
      >
        <span className="text-zinc-300 text-sm font-medium">{t("history")}</span>
        {history.length > 0 && (
          <span className="bg-violet-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
            {history.length > 99 ? "99+" : history.length}
          </span>
        )}
      </button>

      {/* Mobile: bottom sheet */}
      <div
        className={`fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800 z-50 flex flex-col md:hidden transform transition-transform duration-300 max-h-[70vh] ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
          <div>
            <h2 className="text-sm font-semibold text-zinc-100">{t("history")}</h2>
            <p className="text-xs text-zinc-500">{t("historyCount")(history.length)}</p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-zinc-500 hover:text-zinc-300 text-xl leading-none cursor-pointer"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-2">
          {history.length === 0 ? (
            <p className="text-zinc-500 text-sm py-6 text-center">{t("historyEmpty")}</p>
          ) : (
            history.map((item) => <HistoryItem key={item.id} item={item} t={t} onSelect={onSelect} onRemove={onRemove} />)
          )}
        </div>

        {history.length > 0 && (
          <div className="px-4 py-3 border-t border-zinc-800">
            <button
              onClick={clearHistory}
              className="w-full text-xs text-rose-400 hover:text-rose-300 transition-colors py-2 cursor-pointer"
            >
              {t("clearHistory")}
            </button>
          </div>
        )}
      </div>

      {/* Overlay for mobile bottom sheet */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden bg-black/50"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
