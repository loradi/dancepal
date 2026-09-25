# 🕺 DancePal

Aprende los pasos de las coreografías de tus bandas favoritas, **paso a paso y a tu ritmo**.

Inspirada en los millones de jóvenes que ven K-pop en YouTube y quieren aprender sus bailes — pero los tutoriales largos no se pueden practicar por partes.

## Qué hace
- 🎬 **Coreos descompuestas en pasos**, cada una con su video de referencia
- 🐢 **Player de práctica**: velocidad 0.25x–1.5x, loop por paso, modo espejo
- 📈 **Progreso**: marca pasos dominados, % por coreografía

## Stack
- **Frontend:** Next.js 16 (App Router) + TypeScript + Tailwind CSS 4
- **PWA:** `public/manifest.json` + service worker (`public/sw.js`) → instalable en móvil sin tiendas
- **Video:** YouTube IFrame API con timestamps propios (el valor es la estructura, no el hosting)
- **Datos:** seed en `src/lib/data.ts` (Supabase-ready, ver `PLANNING.md` §7.4)
- **Progreso:** localStorage hoy → Supabase Auth + Postgres en v1

## Comandos
```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build de producción
python scripts/gen_icons.py   # regenera iconos PWA
```

## Estructura
```
src/
  app/
    page.tsx              # landing
    coreos/page.tsx       # catálogo + búsqueda
    coreos/[id]/page.tsx  # práctica de una coreo
    perfil/page.tsx       # progreso
  components/
    YouTubePlayer.tsx     # player con speed/loop/mirror
    PwaRegister.tsx
  lib/
    data.ts               # modelo: artist/song/choreo/step + seed
    progress.ts           # progreso local (API lista para Supabase)
public/
  manifest.json, sw.js, icon-*.png
PLANNING.md               # visión, MVP, arquitectura, roadmap
```

## Roadmap
Ver `PLANNING.md`: v1 (catálogo + player + progreso), v2 (UGC covers + retos + pose detection), v3 (contenido oficial, monetización).
