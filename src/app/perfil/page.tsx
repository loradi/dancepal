"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getChoreos } from "@/lib/data";
import { getMastered } from "@/lib/progress";

export default function ProfilePage() {
  const [loaded, setLoaded] = useState(false);
  const choreos = getChoreos();

  useEffect(() => setLoaded(true), []);

  if (!loaded) {
    return <p className="py-16 text-center text-neutral-500">Cargando…</p>;
  }

  const rows = choreos
    .map((c) => {
      const m = getMastered(c.id).filter((id) =>
        c.steps.some((s) => s.id === id)
      ).length;
      return { choreo: c, mastered: m };
    })
    .filter((r) => r.mastered > 0);

  const totalSteps = rows.reduce((a, r) => a + r.mastered, 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Mi progreso</h1>
        <p className="mt-1 text-sm text-neutral-400">
          Lo que practicas se guarda en este dispositivo.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <Stat label="Pasos dominados" value={totalSteps} />
        <Stat label="Coreos en práctica" value={rows.length} />
        <Stat
          label="Completas"
          value={rows.filter(
            (r) => r.mastered === r.choreo.steps.length
          ).length}
        />
      </div>

      {rows.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center">
          <p className="text-4xl">🕺</p>
          <p className="mt-3 font-semibold">Aún no has practicado nada</p>
          <p className="mt-1 text-sm text-neutral-400">
            Elige una coreografía y marca tus primeros pasos.
          </p>
          <Link
            href="/coreos"
            className="mt-5 inline-block rounded-full bg-gradient-to-r from-fuchsia-500 to-violet-500 px-5 py-2.5 text-sm font-semibold text-white"
          >
            Explorar coreografías
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {rows.map(({ choreo, mastered }) => {
            const pct = Math.round((mastered / choreo.steps.length) * 100);
            return (
              <Link
                key={choreo.id}
                href={`/coreos/${choreo.id}`}
                className="block rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-fuchsia-500/50"
              >
                <div className="flex items-center gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={choreo.coverUrl}
                    alt=""
                    className="h-14 w-24 rounded-lg object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-neutral-400">
                      {choreo.artist.name}
                    </p>
                    <p className="truncate font-semibold">
                      {choreo.song.title}
                    </p>
                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-fuchsia-500 to-violet-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                  <span className="font-mono text-sm text-neutral-300">
                    {mastered}/{choreo.steps.length}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
      <p className="text-3xl font-extrabold">{value}</p>
      <p className="mt-1 text-xs text-neutral-400">{label}</p>
    </div>
  );
}
