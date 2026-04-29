import { useState } from "react";

const TRUNCATE_AT = 280;

export default function MovieSynopsis({ movie, t }) {
  const [expanded, setExpanded] = useState(false);
  const text = movie.overview || "";
  const isLong = text.length > TRUNCATE_AT;
  const shown = isLong && !expanded ? text.slice(0, TRUNCATE_AT) + "…" : text;

  return (
    <div>
      <h3 className="text-xs uppercase tracking-widest text-zinc-500 mb-2 font-medium">
        {t("synopsis")}
      </h3>
      <p className="text-zinc-300 text-base leading-relaxed">{shown}</p>
      {isLong && (
        <button
          onClick={() => setExpanded((e) => !e)}
          className="mt-2 text-sm text-violet-400 hover:text-violet-300 transition-colors cursor-pointer"
        >
          {expanded ? t("readLess") : t("readMore")}
        </button>
      )}
    </div>
  );
}
