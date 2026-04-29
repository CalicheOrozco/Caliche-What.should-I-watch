function RatingBadge({ score }) {
  const num = parseFloat(score);
  let cls = "bg-red-900/60 text-red-300";
  if (num >= 7) cls = "bg-emerald-900/60 text-emerald-300";
  else if (num >= 5) cls = "bg-yellow-900/60 text-yellow-300";

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-sm font-semibold ${cls}`}>
      ★ {num.toFixed(1)}
    </span>
  );
}

export default function MovieMeta({ movie, t }) {
  const year = movie.release_date ? movie.release_date.slice(0, 4) : "—";
  const isTV = movie.mediaType === "tv";

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-400 font-medium">
          {isTV ? "📺 TV" : "🎬 Movie"}
        </span>
      </div>
      <h1 className="text-3xl md:text-4xl font-bold text-zinc-100 leading-tight">
        {movie.title}
      </h1>
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-zinc-400 text-sm">{year}</span>
        {isTV && movie.number_of_seasons > 0 ? (
          <span className="text-zinc-500 text-sm">{t("seasons")(movie.number_of_seasons)}</span>
        ) : (
          movie.runtime > 0 && (
            <span className="text-zinc-500 text-sm">{movie.runtime} min</span>
          )
        )}
        <RatingBadge score={movie.vote_average} />
      </div>
      {movie.genres && movie.genres.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {movie.genres.map((g) => (
            <span
              key={g.id}
              className="text-xs px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700"
            >
              {g.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
