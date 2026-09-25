# DancePal — Planificación

## 1. Visión
Una app para que los jóvenes aprendan los pasos y la coreografía de sus bandas favoritas (K-pop y más), descomponiendo el baile en pasos, con video a su ritmo, seguimiento del progreso y una comunidad.

**One-liner:** "Aprende la coreo completa, paso a paso, a tu ritmo."

## 2. Usuario objetivo
- Jóvenes 13–25 que consumen K-pop / reggaetón / pop en YouTube, TikTok y YouTube Shorts.
- Quieren aprender coreografías para practicar, grabar covers o bailar en vivo.
- Dolor actual: los tutoriales de YouTube son largos, no se pueden saltar por pasos, no hay métrica de progreso ni comunidad.

## 3. Propuesta de valor
1. **Coreografía descompuesta en pasos** con video de referencia por paso (no un video de 4 min entero).
2. **Reproducción a tu ritmo**: slow-motion, loop por sección, velocidad ajustable, beat sync.
3. **Progreso**: check de pasos dominados, rachas, nivel por coreo.
4. **Comunidad**: subir tus covers, ver los de otros, retos semanales.

## 4. Funcionalidades

### MVP (v1)
- Catálogo de coreografías (song, artista, dificultad, duración).
- Detalle de coreografía: video general + lista de pasos/sectiones con video por sección.
- Player avanzado: velocidad 0.25x–1.5x, loop de sección, espejo (flip horizontal), overlay opcional.
- Marca de pasos dominados (checklist) + % de progreso por coreo.
- Onboarding simple (email/Google), perfil con progreso global.
- Buscador (por canción, artista, tendencia).

### v2
- Subida de covers por usuarios (UGC) + likes/comentarios.
- Retos semanales con ranking.
- Detección de pose por cámara (feedback de "cuánto se parece tu baile") — ML con MediaPipe/TensorFlow.js.
- Recomendaciones por artista/dificultad.
- Modo "práctica": el video se pausa entre secciones.

### v3 (exploratorio)
- Clases en vivo / sesiones grupales.
- API para creadores de contenido para publicar coreografías.
- Monetización: suscripción DancePal+ (coreos premium, sin límites de práctica), badges, merch.

## 5. Contenido — estrategia clave
| Fase | Fuente | Notas |
|------|--------|-------|
| MVP | Embeds de YouTube (tutoriales existentes) + metadata propia (pasos/secciones mapeadas al timestamp) | Rápido, cero costo legal inicial. El valor está en la ESTRUCTURA (pasos, timestamps, loops), no en hospedar video. |
| v2 | UGC: usuarios suben sus propias coreografías y covers | Genera red, requiere moderación y DRM básico. |
| v3 | Alianzas con agencias/labels para contenido oficial | Alto valor, alto esfuerzo. |

## 6. Stack técnico (propuesta)
- **Frontend:** Next.js (React) + TypeScript, PWA instalable en móvil desde día uno.
  - Player: HLS.js / Video.js o Video.js + plugin de tiempo; espejo con CSS transform.
  - Pose detection (v2): MediaPipe + TensorFlow.js en el navegador (sin backend de ML).
- **Backend:** Supabase (Postgres + Auth + Storage + Realtime) → velocidad de desarrollo. Migrar a Node/Nest + Postgres si crece.
- **Infra:** Vercel (frontend) + Supabase Cloud. CI/CD con GitHub Actions.
- **Alternativa mobile-first:** Flutter (un solo código para iOS/Android/web) si se decide app nativa desde el inicio.

## 7. Arquitectura

### 7.1 ¿Qué es una PWA (y por qué)?
Progressive Web App = web app que se comporta como app nativa:
- **Instalable sin tiendas**: el usuario abre un link (TikTok/WhatsApp) y con "Instalar app" le aparece el icono en la pantalla de inicio, abre a pantalla completa. Sin App Store, sin review, sin $99/año de Apple.
- **Actualizaciones el mismo día** (las apps nativas dependen de la revisión de la tienda).
- **Offline / carga rápida** vía service worker.
- **Un solo código** para iOS, Android y desktop.

Piezas técnicas: `manifest.json` (icónos, nombre, pantalla completa) + **service worker** (cache/offline) + HTTPS obligatorio.

**Trade-offs honestos (iOS):** push notifications limitadas sin contornos; cámara/pose detection algo más restrictiva (MediaPipe en browser sí funciona iOS 15+). Si explota el producto, se puede envolver en app nativa (TWA/Flutter) reutilizando el diseño. Para MVP, la fricción "compartir un link" vs "descargar de la tienda" gana por goleada para la audiencia 13–25.

### 7.2 Capas
```
[Web App — Next.js + TS (PWA: manifest + service worker)]
   ├── UI: landing, catálogo, búsqueda, detalle de coreo (player), perfil
   ├── Player: YouTube IFrame API + timestamps propios (speed, loop, mirror)
   └── Supabase JS SDK (habla directo con el backend, sin servidor propio en MVP)
                 │
[Supabase Cloud — backend como servicio]
   ├── Auth (email / Google / Apple)
   ├── Postgres: artists, songs, choreos, steps, user_progress, covers (v2)
   │     + Row Level Security (cada user solo ve su progreso)
   ├── Storage: imágenes, videos UGC (v2)
   └── Realtime: ranking de retos en vivo (v2)
                 │
[Infra]  Vercel (frontend) + Supabase Cloud (datos) + GitHub Actions (CI/CD: push a main → deploy)
```

### 7.3 Flujo de uso (happy path)
1. Joven abre `dancepal.app` → service worker cachea la app.
2. Login con Google (Supabase Auth).
3. Busca "NewJeans" → frontend consulta Postgres → lista de coreos.
4. Abre "Hype Boy" → player carga video YouTube + steps con timestamps.
5. Toca "practicar paso 3" → seek a `start_ts`, 0.5x, loop hasta `end_ts`.
6. Marca paso dominado → write en `user_progress` → % de coreo sube.

### 7.4 Modelo de datos
- `artist(id, name, image)`
- `song(id, title, artist_id, bpm)`
- `choreo(id, song_id, difficulty, duration)`
- `step(id, choreo_id, order, name, start_ts, end_ts, video_ref, tips)`
- `user_progress(user_id, choreo_id, completed_steps[], last_seen_ts)`
- (v2) `cover(id, user_id, choreo_id, video_url, likes, status)`

## 8. Roadmap
| Fase | Duración | Entregable |
|------|----------|------------|
| 0 — Setup | 1 sem | Repo, CI, base UI (landing + auth + shell) |
| 1 — Catálogo + player | 2–3 sem | 10–20 coreos seed, player con slow/loop/espejo, checklist de pasos |
| 2 — Progreso + onboarding | 1–2 sem | Perfil, rachas, % por coreo, busquedas |
| 3 — Beta | 1 sem | QA, feedback de primeros 50–100 usuarios (Discord/TikTok) |
| 4 — v2 UGC | 4–6 sem | Subida de covers, retos, moderación |
| 5 — v2 ML | 4–6 sem | Feedback de pose por cámara |

## 9. Riesgos
- **Contenido/DRM**: dependemos de YouTube para video → riesgo de bloqueos; mitigar con UGC y luego contenido propio.
- **Cold start de comunidad**: sin covers no hay red → semilla con creadores de TikTok/YouTube de la nicho K-pop.
- **Scope del ML**: pose detection "parecido" es difícil; entrar en v2 con expectativa baja (scoring simple) o descartar.
- **Costo de storage** si UGC explota: límites de duración/codec desde el inicio.

## 10. Decisiones abiertas
- [ ] ¿Web-first (PWA) o app nativa (Flutter/iOS) desde el inicio?
- [ ] ¿Marca: solo K-pop al inicio o K-pop + reggaetón/pop?
- [ ] ¿Nombre de dominio (dancepal.app / dancepal.io)?
- [ ] ¿Monetización desde el día uno (freemium) o crecimiento primero?
