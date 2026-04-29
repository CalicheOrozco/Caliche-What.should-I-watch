import { useState } from "react";

const STORAGE_KEY = "caliche-movies-platforms";

function load() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

export function usePlatforms() {
  const [selectedIds, setSelectedIds] = useState(load);

  function togglePlatform(id) {
    setSelectedIds((prev) => {
      const next = prev.includes(id)
        ? prev.filter((p) => p !== id)
        : [...prev, id];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }

  function clearPlatforms() {
    localStorage.removeItem(STORAGE_KEY);
    setSelectedIds([]);
  }

  function selectAllPlatforms(ids) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    setSelectedIds(ids);
  }

  return { selectedIds, togglePlatform, clearPlatforms, selectAllPlatforms };
}
