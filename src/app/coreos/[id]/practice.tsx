"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { ChoreoDetail } from "@/lib/data";
import { YouTubePlayer } from "@/components/YouTubePlayer";
import { getMastered, toggleMastered } from "@/lib/progress";

export function ChoreoPractice({ choreo }: { choreo: ChoreoDetail }) {
  const [activeId, setActiveId] = useState<string | null>(
    choreo.steps[0]?.id ?? null
  );
  const [mastered, setMastered] = useState<string[]>([]);

  useEffect(() => {
    setMastered(getMastered(choreo.id));
  }, [choreo.id]);

  const activeStep = useMemo(
    () => choreo.steps.find((s) => s.id === activeId) ?? null,
    [choreo.steps, activeId]
  );

  const pct = Math.round(
    (mastered.filter((id) =>
      choreo.steps.some((s) => s.id === id)
    ).length /
      choreo.steps.length) *
      100
  );

  const toggle = (stepId: string) => {
    setMastered(toggleMastered(choreo.id, stepId));
  };

  const nextStep = () => {
    const idx = choreo.steps.findIndex((s) => s.id === activeId);
    if (idx >= 0 && idx < choreo.steps.length - 1) {
      setActiveId(choreo.steps[idx + 1].id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <Link
          href="/coreos"
          className="text-sm text-neutral-400 transition hover:text-white"
        >
          ← Coreos
        </Link>
        <div className="ml-auto flex items-center gap-2 text-sm">
          <div className="h-2 w-32 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-fuchsia-500 to-violet-500 transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="font-mono text-xs text-neutral-400">{pct}%</span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Player */}
        <div>
          <h1 className="text-2xl font-bold">{choreo.song.title}</h1>
          <p className="text-sm text-neutral-400">
            {choreo.artist.name} · {choreo.steps.length} pasos
          </p>
          <div className="mt-4">
            <YouTubePlayer videoId={choreo.videoId} step={activeStep} />
          </div>
        </div>

        {/* Pasos */}
        <aside className="space-y-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-400">
            Pasos
          </h2>
          <div className="space-y-2">
            {choreo.steps.map((s) => {
              const isActive = s.id === activeId;
              const isDone = mastered.includes(s.id);
              return (
                <div
                  key={s.id}
                  onClick={() => setActiveId(s.id)}
                  className={`cursor-pointer rounded-xl border p-3 transition ${
                    isActive
                      ? "border-fuchsia-500/60 bg-fuchsia-500/10"
                      : "border-white/10 bg-white/5 hover:border-white/25"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggle(s.id);
                      }}
                      title={isDone ? "Marcar como pendiente" : "Marcar como dominado"}
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs transition ${
                        isDone
                          ? "border-emerald-400 bg-emerald-400 text-black"
                          : "border-neutral-500 text-transparent hover:border-emerald-400"
                      }`}
                    >
                      ✓
                    </button>
                    <span className="font-mono text-xs text-neutral-500">
                      {s.order}
                    </span>
                    <span
                      className={`truncate text-sm font-medium ${
                        isDone ? "line-through opacity-60" : ""
                      }`}
                    >
                      {s.name}
                    </span>
                    <span className="ml-auto shrink-0 font-mono text-[11px] text-neutral-500">
                      {fmt(s.startTs)}
                    </span>
                  </div>
                  {isActive && (
                    <p className="mt-2 pl-9 text-xs text-neutral-400">
                      {s.tips}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
          {activeStep && (
            <button
              onClick={nextStep}
              className="mt-3 w-full rounded-full border border-white/15 py-2 text-sm font-medium text-neutral-300 transition hover:bg-white/5"
            >
              Siguiente paso →
            </button>
          )}
        </aside>
      </div>
    </div>
  );
}

const fmt = (t: number) =>
  `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, "0")}`;
