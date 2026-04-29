const BASE = "https://api.themoviedb.org/3";
const KEY = import.meta.env.VITE_TMDB_API_KEY;

export const IMG_BASE = "https://image.tmdb.org/t/p/w500";
export const LOGO_BASE = "https://image.tmdb.org/t/p/w92";

async function get(path, params = {}) {
  const url = new URL(`${BASE}${path}`);
  url.searchParams.set("api_key", KEY);
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== "") {
      url.searchParams.set(k, String(v));
    }
  }
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`TMDB ${res.status}: ${path}`);
  return res.json();
}

export async function discoverMovies(params) {
  return get("/discover/movie", params);
}

export async function discoverTV(params) {
  return get("/discover/tv", params);
}

export async function getMovieDetails(id, lang = "en") {
  return get(`/movie/${id}`, { language: lang === "es" ? "es-MX" : "en-US" });
}

export async function getTVDetails(id, lang = "en") {
  return get(`/tv/${id}`, { language: lang === "es" ? "es-MX" : "en-US" });
}

export async function getMovieVideos(id) {
  return get(`/movie/${id}/videos`);
}

export async function getTVVideos(id) {
  return get(`/tv/${id}/videos`);
}

export async function getMovieWatchProviders(id) {
  return get(`/movie/${id}/watch/providers`);
}

export async function getTVWatchProviders(id) {
  return get(`/tv/${id}/watch/providers`);
}

// Keep old name as alias for backwards compat in WatchProviders component
export { getMovieWatchProviders as getWatchProviders };

// Returns all streaming providers available in a given country
export async function getAvailableProviders(mediaType, country) {
  return get(`/watch/providers/${mediaType}`, {
    watch_region: country,
    language: "en-US",
  });
}
