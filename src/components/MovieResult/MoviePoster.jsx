import { IMG_BASE } from "../../services/tmdb";

export default function MoviePoster({ movie }) {
  if (!movie.poster_path) {
    return (
      <div className="w-full aspect-[2/3] rounded-2xl bg-zinc-800 flex items-center justify-center">
        <span className="text-4xl font-bold text-zinc-600 text-center px-4">
          {movie.title
            .split(" ")
            .slice(0, 2)
            .map((w) => w[0])
            .join("")
            .toUpperCase()}
        </span>
      </div>
    );
  }

  return (
    <img
      src={`${IMG_BASE}${movie.poster_path}`}
      alt={movie.title}
      className="w-full rounded-2xl shadow-2xl object-cover"
    />
  );
}
