import { useState, useMemo } from "react";

const STORAGE_KEY = "caliche-movies-history";

function load() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

export function useHistory() {
  const [history, setHistory] = useState(load);

  const historyIds = useMemo(() => new Set(history.map((h) => h.id)), [history]);

  function addToHistory(movie, liked) {
    setHistory((prev) => {
      const filtered = prev.filter((h) => h.id !== movie.id);
      const entry = {
        id: movie.id,
        title: movie.title,
        poster: movie.poster_path || null,
        mediaType: movie.mediaType || "movie",
        liked,
        date: new Date().toISOString(),
      };
      const next = [entry, ...filtered];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }

  function removeFromHistory(id) {
    setHistory((prev) => {
      const next = prev.filter((h) => h.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }

  function clearHistory() {
    localStorage.removeItem(STORAGE_KEY);
    setHistory([]);
  }

  return { history, historyIds, addToHistory, removeFromHistory, clearHistory };
}
