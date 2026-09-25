"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { getChoreos, type Difficulty } from "@/lib/data";

const DIFF: Record<Difficulty, { label: string; cls: string }> = {
  easy: { label: "Fácil", cls: "bg-emerald-500/15 text-emerald-300" },
  medium: { label: "Media", cls: "bg-amber-500/15 text-amber-300" },
  hard: { label: "Difícil", cls: "bg-rose-500/15 text-rose-300" },
};

const fmtDur = (s: number) =>
  `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

export default function CatalogPage() {
  const [q, setQ] = useState("");
  const choreos = getChoreos();
  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return choreos;
    return choreos.filter(
      (c) =>
        c.song.title.toLowerCase().includes(needle) ||
        c.artist.name.toLowerCase().includes(needle)
    );
  }, [q, choreos]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Coreografías</h1>
        <p className="mt-1 text-sm text-neutral-400">
          {results.length} coreo{results.length !== 1 && "s"} disponibles
        </p>
      </div>

      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Buscar por canción o artista…"
        className="w-full rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm outline-none transition placeholder:text-neutral-500 focus:border-fuchsia-500/60"
      />

      {results.length === 0 ? (
        <p className="py-16 text-center text-neutral-500">
          No encontramos coreos para “{q}”.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((c) => (
            <Link
              key={c.id}
              href={`/coreos/${c.id}`}
              className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition hover:border-fuchsia-500/50"
            >
              <div className="relative aspect-video w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={c.coverUrl}
                  alt={c.song.title}
                  className="h-full w-full object-cover transition group-hover:scale-105"
                />
                <span
                  className={`absolute right-2 top-2 rounded-full px-2 py-0.5 text-[11px] font-medium ${DIFF[c.difficulty].cls}`}
                >
                  {DIFF[c.difficulty].label}
                </span>
              </div>
              <div className="flex items-center justify-between p-4">
                <div>
                  <p className="text-xs text-neutral-400">{c.artist.name}</p>
                  <p className="font-semibold">{c.song.title}</p>
                </div>
                <span className="font-mono text-xs text-neutral-500">
                  {fmtDur(c.duration)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
