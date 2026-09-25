// Data layer — Supabase-ready.
// hoy: seed local. mañana: mismo shape via Supabase (ver PLANNING.md §7.4).

export type Difficulty = "easy" | "medium" | "hard";

export interface Artist {
  id: string;
  name: string;
}

export interface Song {
  id: string;
  title: string;
  artistId: string;
  bpm: number;
}

export interface Step {
  id: string;
  choreoId: string;
  order: number;
  name: string;
  /** segundos en el video de referencia */
  startTs: number;
  endTs: number;
  tips: string;
}

export interface Choreo {
  id: string;
  songId: string;
  difficulty: Difficulty;
  duration: number; // segundos
  /** YouTube video id (embed de referencia) */
  videoId: string;
  coverUrl: string; // https://i.ytimg.com/vi/<videoId>/hqdefault.jpg
}

export interface ChoreoDetail extends Choreo {
  song: Song;
  artist: Artist;
  steps: Step[];
}

const artists: Record<string, Artist> = {
  newjeans: { id: "newjeans", name: "NewJeans" },
  bts: { id: "bts", name: "BTS" },
  blackpink: { id: "blackpink", name: "BLACKPINK" },
};

const songs: Record<string, Song> = {
  hypeboy: { id: "hypeboy", title: "Hype Boy", artistId: "newjeans", bpm: 110 },
  butter: { id: "butter", title: "Butter", artistId: "bts", bpm: 115 },
  howyoulikethat: { id: "howyoulikethat", title: "How You Like That", artistId: "blackpink", bpm: 105 },
};

const choreos: Record<string, Choreo> = {
  "hype-boy": {
    id: "hype-boy",
    songId: "hypeboy",
    difficulty: "medium",
    duration: 205,
    videoId: "9JcJ5E1BloU",
    coverUrl: "https://i.ytimg.com/vi/9JcJ5E1BloU/hqdefault.jpg",
  },
  butter: {
    id: "butter",
    songId: "butter",
    difficulty: "easy",
    duration: 187,
    videoId: "ujf3iJoWgrM",
    coverUrl: "https://i.ytimg.com/vi/ujf3iJoWgrM/hqdefault.jpg",
  },
  "how-you-like-that": {
    id: "how-you-like-that",
    songId: "howyoulikethat",
    difficulty: "hard",
    duration: 183,
    videoId: "0iDUwhWBk28",
    coverUrl: "https://i.ytimg.com/vi/0iDUwhWBk28/hqdefault.jpg",
  },
};

// Timestamps aproximados (sección de la práctica) — refinables en v1.
const steps: Step[] = [
  // Hype Boy
  { id: "hb-1", choreoId: "hype-boy", order: 1, name: "Intro — pose de entrada", startTs: 0, endTs: 24, tips: "Marca el ritmo con el pecho antes del drop. Mantén la mirada firme." },
  { id: "hb-2", choreoId: "hype-boy", order: 2, name: "Verse 1 — body wave + brazo", startTs: 24, endTs: 52, tips: "El wave sale de la cadera, no del hombro. Lento y fluido." },
  { id: "hb-3", choreoId: "hype-boy", order: 3, name: "Pre-chorus — hand gesture 'hype'", startTs: 52, endTs: 80, tips: "El gesto icónico: mano hacia arriba con pulgar. Practícalo en espejo 0.5x." },
  { id: "hb-4", choreoId: "hype-boy", order: 4, name: "Chorus — 'Hype boy, all I wanna'", startTs: 80, endTs: 108, tips: "Pies en ocho, acento en 'HYPE'. Es la parte que más piden en covers." },
  { id: "hb-5", choreoId: "hype-boy", order: 5, name: "Bridge + outro — pose final", startTs: 108, endTs: 205, tips: "Cierre con la pose de 'close your eyes'. Congela 2 seg al final." },
  // Butter
  { id: "bt-1", choreoId: "butter", order: 1, name: "Intro — hand slide", startTs: 0, endTs: 20, tips: "Manos suaves, como deslizándolas sobre mantequilla. Sin rigidez." },
  { id: "bt-2", choreoId: "butter", order: 2, name: "Verse — 'smooth like butter'", startTs: 20, endTs: 48, tips: "El paso lateral con giro de cadera es la base. Piernas relajadas." },
  { id: "bt-3", choreoId: "butter", order: 3, name: "Chorus — 'break it down'", startTs: 48, endTs: 80, tips: "Baja el torso, golpea el acento. Es el punto viral: practícalo en loop." },
  { id: "bt-4", choreoId: "butter", order: 4, name: "Outro — final pose", startTs: 80, endTs: 187, tips: "Termina mirando a cámara con la mano en la mejilla." },
  // How You Like That
  { id: "hy-1", choreoId: "how-you-like-that", order: 1, name: "Intro — 'Light up the sky'", startTs: 0, endTs: 40, tips: "Brazos arriba, energía alta. No ahorres fuerza aquí." },
  { id: "hy-2", choreoId: "how-you-like-that", order: 2, name: "Verse — 'Ha how you like that?'", startTs: 40, endTs: 75, tips: "El gesto de 'ha' con el puño: preciso y seco, no blando." },
  { id: "hy-3", choreoId: "how-you-like-that", order: 3, name: "Chorus — 'Look at you now look at me'", startTs: 75, endTs: 110, tips: "Cambio rápido de dirección: izquierda-derecha-izquierda. Cuenta de a 4." },
  { id: "hy-4", choreoId: "how-you-like-that", order: 4, name: "Bridge — 'Bring out your boss bish'", startTs: 110, endTs: 150, tips: "Es la parte más intensa: apoya bien las piernas, cadera baja." },
  { id: "hy-5", choreoId: "how-you-like-that", order: 5, name: "Final — 'How you like that' x3 + pose", startTs: 150, endTs: 183, tips: "Cierre potente, con actitud. La pose final se sostiene 3 segundos." },
];

export function getChoreos(): ChoreoDetail[] {
  return Object.values(choreos).map((c) => ({
    ...c,
    song: songs[c.songId],
    artist: artists[songs[c.songId].artistId],
    steps: steps
      .filter((s) => s.choreoId === c.id)
      .sort((a, b) => a.order - b.order),
  }));
}

export function getChoreo(id: string): ChoreoDetail | undefined {
  return getChoreos().find((c) => c.id === id);
}

export function searchChoreos(q: string): ChoreoDetail[] {
  const needle = q.trim().toLowerCase();
  if (!needle) return getChoreos();
  return getChoreos().filter(
    (c) =>
      c.song.title.toLowerCase().includes(needle) ||
      c.artist.name.toLowerCase().includes(needle)
  );
}
