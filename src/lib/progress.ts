// Progreso local (localStorage).
// En v1 se reemplaza por Supabase Auth + tabla user_progress con el mismo API.

const KEY = "dancepal_progress_v1";

type ProgressMap = Record<string, string[]>; // choreoId -> stepIds dominados

function read(): ProgressMap {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(KEY) ?? "{}");
  } catch {
    return {};
  }
}

function write(map: ProgressMap) {
  window.localStorage.setItem(KEY, JSON.stringify(map));
}

export function getMastered(choreoId: string): string[] {
  return read()[choreoId] ?? [];
}

export function toggleMastered(choreoId: string, stepId: string): string[] {
  const map = read();
  const cur = map[choreoId] ?? [];
  const next = cur.includes(stepId)
    ? cur.filter((id) => id !== stepId)
    : [...cur, stepId];
  map[choreoId] = next;
  write(map);
  return next;
}

export function getSummary() {
  const map = read();
  return Object.entries(map)
    .map(([choreoId, steps]) => ({ choreoId, mastered: steps.length }))
    .filter((e) => e.mastered > 0);
}
