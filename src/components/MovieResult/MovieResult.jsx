import MoviePoster from "./MoviePoster";
import MovieMeta from "./MovieMeta";
import MovieSynopsis from "./MovieSynopsis";
import TrailerEmbed from "./TrailerEmbed";
import WatchProviders from "./WatchProviders";
import MovieActions from "./MovieActions";

export default function MovieResult({
  movie,
  trailer,
  providers,
  country,
  onCountryChange,
  onLike,
  onReject,
  onGetAnother,
  t,
}) {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8 items-start">
        {/* Poster */}
        <div className="md:sticky md:top-8">
          <MoviePoster movie={movie} />
        </div>

        {/* Details */}
        <div className="flex flex-col gap-6">
          <MovieMeta movie={movie} t={t} />
          <MovieSynopsis movie={movie} t={t} />
          <WatchProviders
            providers={providers}
            country={country}
            onCountryChange={onCountryChange}
            t={t}
          />
          <TrailerEmbed videoKey={trailer} t={t} />
          <MovieActions
            onLike={onLike}
            onReject={onReject}
            onGetAnother={onGetAnother}
            t={t}
          />
        </div>
      </div>
    </div>
  );
}
