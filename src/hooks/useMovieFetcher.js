import { useState, useCallback } from "react";
import {
  GENRE_IDS,
  TV_GENRE_IDS,
  MOOD_TO_GENRES,
  TV_MOOD_TO_GENRES,
  WHO_WITH_TO_GENRES,
  TV_WHO_WITH_TO_GENRES,
} from "../constants/genres";
import { ERA_TO_DATES } from "../constants/eras";
import {
  discoverMovies,
  discoverTV,
  getMovieDetails,
  getTVDetails,
  getMovieVideos,
  getTVVideos,
  getMovieWatchProviders,
  getTVWatchProviders,
} from "../services/tmdb";

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildParams(answers, lang, selectedProviderIds, country) {
  const isTV = answers.mediaType === "tv";
  const genreMap = isTV ? TV_GENRE_IDS : GENRE_IDS;
  const moodMap = isTV ? TV_MOOD_TO_GENRES : MOOD_TO_GENRES;
  const whoMap = isTV ? TV_WHO_WITH_TO_GENRES : WHO_WITH_TO_GENRES;

  const params = {
    sort_by: "popularity.desc",
    "vote_count.gte": 50,
    language: lang === "es" ? "es-MX" : "en-US",
  };

  // --- Genre (mood + explicit pick + who-with fallback) ---
  let genreIds = [];

  if (answers.mood && answers.mood !== "Surprise Me") {
    genreIds = [...(moodMap[answers.mood] || [])];
  }

  if (answers.genre && answers.genre !== "Any") {
    const gid = genreMap[answers.genre];
    if (gid) genreIds = [gid];
  }

  // "Who with" influences genre only when no explicit genre was chosen
  if (genreIds.length === 0 && answers.whoWith) {
    genreIds = [...(whoMap[answers.whoWith] || [])];
  }

  if (genreIds.length > 0) {
    params.with_genres = genreIds.join("|");
  }

  // --- Era ---
  if (answers.era && answers.era !== "Any") {
    const range = ERA_TO_DATES[answers.era];
    if (range) {
      const dateField = isTV ? "first_air_date" : "primary_release_date";
      params[`${dateField}.gte`] = range.gte;
      params[`${dateField}.lte`] = range.lte;
    }
  }

  // --- Rating ---
  if (answers.rating === "Highly rated (7+)") {
    params["vote_average.gte"] = 7;
  } else if (answers.rating === "Decent (5–7)") {
    params["vote_average.gte"] = 5;
    params["vote_average.lte"] = 7;
  }

  // --- Duration (movies only — TV runtime = episode length, less meaningful) ---
  if (!isTV && answers.duration) {
    if (answers.duration === "Short") {
      params["with_runtime.lte"] = 90;
    } else if (answers.duration === "Normal") {
      params["with_runtime.gte"] = 90;
      params["with_runtime.lte"] = 120;
    } else if (answers.duration === "Long") {
      params["with_runtime.gte"] = 120;
    }
  }

  // --- Original language ---
  if (answers.language === "English") {
    params.with_original_language = "en";
  } else if (answers.language === "Spanish") {
    params.with_original_language = "es";
  }

  // --- Popularity ---
  if (answers.popularity === "Blockbuster") {
    params["vote_count.gte"] = 1000;
  } else if (answers.popularity === "Hidden gem") {
    params["vote_count.gte"] = 50;
    params["vote_count.lte"] = 500;
    params.sort_by = "vote_average.desc";
  }

  // --- Streaming platforms ---
  if (selectedProviderIds && selectedProviderIds.length > 0) {
    params.with_watch_providers = selectedProviderIds.join("|");
    params.watch_region = country || "US";
  }

  return params;
}

function normalizeResult(details, isTV) {
  if (!isTV) return { ...details, mediaType: "movie" };
  return {
    ...details,
    title: details.name || details.title,
    release_date: details.first_air_date || details.release_date,
    runtime: details.episode_run_time?.[0] || 0,
    mediaType: "tv",
  };
}

export function useMovieFetcher() {
  const [status, setStatus] = useState("idle");
  const [movie, setMovie] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const [providers, setProviders] = useState(null);
  const [error, setError] = useState(null);

  const fetchMovie = useCallback(async (
    answers = {},
    historyIds = new Set(),
    lang = "en",
    { selectedProviderIds = [], country = "US" } = {}
  ) => {
    setStatus("loading");
    setError(null);
    const isTV = answers.mediaType === "tv";
    const discover = isTV ? discoverTV : discoverMovies;
    const getDetails = isTV ? getTVDetails : getMovieDetails;
    const getVideos = isTV ? getTVVideos : getMovieVideos;
    const getProviders = isTV ? getTVWatchProviders : getMovieWatchProviders;

    try {
      const params = buildParams(answers, lang, selectedProviderIds, country);

      const first = await discover({ ...params, page: 1 });
      const totalPages = Math.min(first.total_pages || 1, 40);

      let picked = null;
      let attempts = 0;
      const maxAttempts = 5;

      while (!picked && attempts < maxAttempts) {
        const page =
          attempts === 0 && totalPages === 1
            ? 1
            : Math.floor(Math.random() * totalPages) + 1;

        let results;
        if (page === 1 && first.results) {
          results = shuffle(first.results);
        } else {
          const data = await discover({ ...params, page });
          results = shuffle(data.results || []);
        }

        picked = results.find((m) => !historyIds.has(m.id)) || null;
        attempts++;
      }

      if (!picked) {
        picked = shuffle(first.results || [])[0] || null;
      }

      if (!picked) throw new Error("No results found for these filters.");

      const [details, videos, watchProviders] = await Promise.all([
        getDetails(picked.id, lang),
        getVideos(picked.id),
        getProviders(picked.id),
      ]);

      const trailerVideo =
        (videos.results || []).find(
          (v) => v.type === "Trailer" && v.site === "YouTube"
        ) || null;

      setMovie(normalizeResult(details, isTV));
      setTrailer(trailerVideo ? trailerVideo.key : null);
      setProviders(watchProviders.results || {});
      setStatus("success");
    } catch (err) {
      setError(err.message);
      setStatus("error");
      throw err;
    }
  }, []);

  const fetchById = useCallback(async (id, mediaType, lang = "en") => {
    setStatus("loading");
    setError(null);
    const isTV = mediaType === "tv";
    const getDetails = isTV ? getTVDetails : getMovieDetails;
    const getVideos = isTV ? getTVVideos : getMovieVideos;
    const getProviders = isTV ? getTVWatchProviders : getMovieWatchProviders;

    try {
      const [details, videos, watchProviders] = await Promise.all([
        getDetails(id, lang),
        getVideos(id),
        getProviders(id),
      ]);

      const trailerVideo =
        (videos.results || []).find(
          (v) => v.type === "Trailer" && v.site === "YouTube"
        ) || null;

      setMovie(normalizeResult(details, isTV));
      setTrailer(trailerVideo ? trailerVideo.key : null);
      setProviders(watchProviders.results || {});
      setStatus("success");
    } catch (err) {
      setError(err.message);
      setStatus("error");
      throw err;
    }
  }, []);

  return { status, movie, trailer, providers, error, fetchMovie, fetchById };
}
