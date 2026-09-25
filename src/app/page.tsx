import Link from "next/link";
import { getChoreos } from "@/lib/data";

const features = [
  {
    icon: "🎬",
    title: "Paso a paso",
    desc: "Cada coreografía está descompuesta en pasos con su video de referencia. Nada de videos de 4 minutos sin estructura.",
  },
  {
    icon: "🐢",
    title: "A tu ritmo",
    desc: "Velocidad desde 0.25x hasta 1.5x, loop por paso y modo espejo. Practica la parte difícil hasta que salga.",
  },
  {
    icon: "📈",
    title: "Progreso real",
    desc: "Marca los pasos que dominas, mira tu % por coreografía y sigue tu racha semana a semana.",
  },
];

export default function Home() {
  const choreos = getChoreos();
  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="pt-8 text-center">
        <h1 className="mx-auto max-w-3xl text-4xl font-extrabold leading-tight sm:text-5xl">
          Aprende la coreografía completa,{" "}
          <span className="bg-gradient-to-r from-fuchsia-400 to-violet-400 bg-clip-text text-transparent">
            paso a paso
          </span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-neutral-400">
          Tu banda favorita salió con coreografía nueva. DancePal la descompone
          en pasos para que la aprendas a tu ritmo, con slow-motion, loop y
          espejo.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/coreos"
            className="rounded-full bg-gradient-to-r from-fuchsia-500 to-violet-500 px-6 py-3 font-semibold text-white transition hover:opacity-90"
          >
            Explorar coreografías →
          </Link>
          <a
            href="#como-funciona"
            className="rounded-full border border-white/15 px-6 py-3 font-medium text-neutral-300 transition hover:bg-white/5"
          >
            Cómo funciona
          </a>
        </div>
      </section>

      {/* Catálogo preview */}
      <section>
        <h2 className="mb-4 text-lg font-semibold">Para empezar</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {choreos.map((c) => (
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
              </div>
              <div className="p-4">
                <p className="text-xs text-neutral-400">{c.artist.name}</p>
                <p className="font-semibold">{c.song.title}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Cómo funciona */}
      <section id="como-funciona" className="space-y-6">
        <h2 className="text-lg font-semibold">Cómo funciona</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-white/10 bg-white/5 p-5"
            >
              <div className="text-3xl">{f.icon}</div>
              <h3 className="mt-3 font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-neutral-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
