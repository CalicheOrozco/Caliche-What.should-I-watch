export default function TrailerEmbed({ videoKey, t }) {
  if (!videoKey) {
    return (
      <div className="w-full aspect-video rounded-xl bg-zinc-800 flex items-center justify-center">
        <p className="text-zinc-500 text-sm">{t("noTrailer")}</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-xs uppercase tracking-widest text-zinc-500 mb-2 font-medium">
        {t("trailerLabel")}
      </h3>
      <div className="relative w-full aspect-video rounded-xl overflow-hidden">
        <iframe
          src={`https://www.youtube.com/embed/${videoKey}`}
          title="Movie trailer"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          className="absolute inset-0 w-full h-full"
        />
      </div>
    </div>
  );
}
