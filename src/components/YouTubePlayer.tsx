"use client";

import { useEffect, useRef, useState } from "react";
import type { Step } from "@/lib/data";

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

interface PlayerProps {
  videoId: string;
  /** paso activo: el player hará seek y lo usará como contexto de loop */
  step: Step | null;
  /** velocidad actual (1 = normal) */
  onTimeUpdate?: (t: number) => void;
}

let ytApiPromise: Promise<any> | null = null;
function loadYT(): Promise<any> {
  if (!ytApiPromise) {
    ytApiPromise = new Promise((resolve) => {
      if (window.YT?.Player) return resolve(window.YT);
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        prev?.();
        resolve(window.YT);
      };
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(tag);
    });
  }
  return ytApiPromise;
}

const SPEEDS = [0.25, 0.5, 0.75, 1, 1.25, 1.5];

export function YouTubePlayer({ videoId, step, onTimeUpdate }: PlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const [ready, setReady] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [mirror, setMirror] = useState(false);
  const [loopStep, setLoopStep] = useState(false);
  const [current, setCurrent] = useState(0);
  const stepRef = useRef(step);
  stepRef.current = step;
  const loopRef = useRef(loopStep);
  loopRef.current = loopStep;

  // init player
  useEffect(() => {
    let cancelled = false;
    let tick: ReturnType<typeof setInterval> | null = null;
    loadYT().then((YT) => {
      if (cancelled || !containerRef.current) return;
      const host = document.createElement("div");
      containerRef.current.appendChild(host);
      playerRef.current = new YT.Player(host, {
        videoId,
        width: "100%",
        height: "100%",
        playerVars: {
          playsinline: 1,
          rel: 0,
          modestbranding: 1,
          iv_load_policy: 3,
          start: 0,
        },
        events: {
          onReady: () => setReady(true),
          onStateChange: (e: any) => {
            if (e.data === 1) {
              // playing
              if (stepRef.current) playerRef.current?.seekTo(stepRef.current.startTs, true);
            }
          },
        },
      });
      tick = setInterval(() => {
        const p = playerRef.current;
        if (!p?.getCurrentTime) return;
        const t = p.getCurrentTime();
        setCurrent(t);
        onTimeUpdate?.(t);
        // loop de paso
        const s = stepRef.current;
        if (loopRef.current && s && t >= s.endTs) {
          p.seekTo(s.startTs, true);
        }
      }, 250);
    });
    return () => {
      cancelled = true;
      if (tick) clearInterval(tick);
      try {
        playerRef.current?.destroy();
      } catch {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId]);

  // seek al cambiar de paso
  useEffect(() => {
    if (!ready) return;
    if (step) playerRef.current?.seekTo(step.startTs, true);
  }, [step, ready]);

  const changeSpeed = (s: number) => {
    setSpeed(s);
    playerRef.current?.setPlaybackRate(s);
  };

  const practiceStep = () => {
    if (!step) return;
    playerRef.current?.seekTo(step.startTs, true);
    playerRef.current?.playVideo();
    setLoopStep(true);
  };

  const fmt = (t: number) =>
    `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, "0")}`;

  return (
    <div className="w-full">
      <div
        className="relative w-full overflow-hidden rounded-2xl bg-black shadow-lg"
        style={{ aspectRatio: "16 / 9" }}
      >
        <div
          ref={containerRef}
          className="absolute inset-0 transition-transform"
          style={{ transform: mirror ? "scaleX(-1)" : "none" }}
        />
        {!ready && (
          <div className="absolute inset-0 flex items-center justify-center text-neutral-400 text-sm">
            Cargando player…
          </div>
        )}
      </div>

      {/* Controles */}
      <div className="mt-3 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 rounded-full bg-neutral-900 p-1 dark:bg-neutral-800">
            {SPEEDS.map((s) => (
              <button
                key={s}
                onClick={() => changeSpeed(s)}
                className={`rounded-full px-2.5 py-1 text-xs font-medium transition ${
                  speed === s
                    ? "bg-fuchsia-500 text-white"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                {s}x
              </button>
            ))}
          </div>

          <button
            onClick={() => setMirror((m) => !m)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
              mirror
                ? "bg-fuchsia-500 text-white"
                : "bg-neutral-900 text-neutral-300 dark:bg-neutral-800"
            }`}
          >
            🪞 Espejo
          </button>

          {step && (
            <>
              <button
                onClick={() => setLoopStep((l) => !l)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  loopStep
                    ? "bg-fuchsia-500 text-white"
                    : "bg-neutral-900 text-neutral-300 dark:bg-neutral-800"
                }`}
              >
                🔁 Loop paso {loopStep ? "ON" : "OFF"}
              </button>
              <button
                onClick={practiceStep}
                className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-neutral-900 transition hover:bg-fuchsia-200 dark:bg-fuchsia-500 dark:text-white"
              >
                ▶ Practicar paso
              </button>
            </>
          )}

          <span className="ml-auto font-mono text-xs text-neutral-400">
            {fmt(current)}
            {step ? ` / ${fmt(step.endTs)}` : ""}
          </span>
        </div>

        {step && (
          <p className="text-xs text-neutral-400">
            <span className="font-semibold text-neutral-200">{step.name}</span>
            {" — "}
            {step.tips}
          </p>
        )}
      </div>
    </div>
  );
}
