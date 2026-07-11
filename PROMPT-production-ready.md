# PROMPT — Make the ÆTHER hoodie site production-ready

You are working on **ÆTHER**, a cinematic luxury hoodie landing page. Your job is to fix every fault listed below and take it to true production quality — the bar is: a visitor should believe a top agency shipped this, nothing should look AI-generated, half-finished, or janky. Do not redesign the concept; elevate and finish it.

## Project context

- Location: `C:\Users\79akh\Downloads\dbs11\aether` (Next.js 16 App Router, Tailwind v4, `motion` v12 (framer), Lenis smooth scroll, React Three Fiber + drei, TypeScript). Dev: `npx next dev -p 3012`. Package manager pnpm, but run binaries via `./node_modules/.bin/` (`pnpm exec` fails on ignored build scripts).
- Page structure (`components/experience.tsx`): Loader → Hero (3D hoodie) → Marquee → CollectionsGrid → **F1 world** (scroll-scrubbed video Act I + 3D hoodie stage Act II) → **CarTransit** (scroll-driven 3D Ferrari drives into a neon portal → Anime) → **Anime world** → WorldBridge → **Exotic Cars world** (two crossfading scrub videos) → WorldBridge → **Emirati world** → WorldBridge → **FIFA world** → Marquee → Footer.
- Scroll-scrub videos: `public/media/scrub-*.mp4`, re-encoded all-intra (`-g 1`) so `currentTime` seeks are instant. Keep this property if you re-encode.
- 3D assets: `public/media/hoodie-f1.glb` (hoodie with painted F1 "Apex GP" livery; livery painter script at `Downloads\_hoodie_work\paint_f1.py` — UV panels need vertical-flip mode 2), `public/media/car.glb` (three.js Ferrari; nodes `body`, `rim_*`, `glass`, `wheel_*`).

## CRITICAL — do not regress these

1. **motion v12 WAAPI bug workaround.** Every `useScroll` progress is mirrored through a plain `useMotionValue` (see comment in `components/sections/shared.tsx`). Without the mirror, motion promotes scroll-linked styles to native ViewTimeline animations whose keyframes don't pad partial input ranges to [0,1], and the browser interpolates back to the underlying style — silently corrupting every overlay window. Keep the mirror pattern (or pad every keyframe array to full [0,1] range if you refactor). Verify with `el.getAnimations()` → must be empty on scroll-driven elements.
2. All-intra encoding of scrub videos (seek-per-frame depends on it).
3. `ScrollVideo` seek throttling (`!video.seeking && delta > 1/30`) and lazy loading via IntersectionObserver.
4. ModelViewer clones the GLTF scene + materials per instance (two viewers share one cache otherwise).
5. Auto-rotate pauses off-screen (IntersectionObserver in `model-viewer.tsx`).

## Faults to fix — every one of them

### A. Hero (first impression — highest priority)
- Composition doesn't match the intended design (`hero2.png` in repo root): the headline should dominate with the hoodie large, centered, partially *behind* the text with proper depth (text above, hoodie slightly overlapping the lower half). Currently the hoodie floats small and disconnected below the headline; the "DRAG TO ROTATE" hint collides with the hoodie's bottom on some viewports.
- Hoodie initial pose should face the camera with the chest ÆTHER/APEX GP graphic fully visible on load; auto-rotate should be a slow oscillation (sway ±20°) rather than a full spin so the front graphic is the resting state.
- The 3D loading state is a bare text line ("Loading the atelier…"). Build a proper staged reveal: skeleton silhouette or blurred poster → fade the model in, coordinated with the site Loader so the model never pops in raw. `components/loader.tsx` progress is fake — tie it to real asset readiness (fonts + hero GLB + first video metadata).
- Typography: tighten tracking/leading of the display font at each breakpoint; the chrome gradient on the headline bands weirdly at some sizes — refine `text-chrome` in `app/globals.css`.
- Add subtle cinematic motion at rest: slow parallax drift on particles, faint red rim-light sweep across the hoodie every ~8s. Nothing should feel static, nothing should feel busy.

### B. Honest UI — remove or implement fake elements
- Cart badge is hardcoded "3"; sound toggle does nothing; "Add to Bag" buttons do nothing; footer email form does nothing. For production either implement (client-side cart drawer with state + localStorage, real mute toggle wired to an ambient audio loop, form → a real endpoint or mailto fallback with success state) or remove. No dead controls.
- `app/sadaqah/` is a leftover route from a different project living inside this app. Delete it and its assets/deps.

### C. Performance budget (measure, don't guess)
- Six all-intra 1080p MP4s total ~110 MB. Produce a 720p tier (~40 MB total) and serve by viewport/`navigator.connection`; consider poster-first loading (show frame-0 poster image instantly, attach video src on first scroll intent). Target: landing LCP < 2.5s on Fast 3G-throttled desktop, no long-task > 200ms during scroll on a mid-tier laptop.
- Decimate `hoodie-f1.glb` (465k triangles → ≤ 80k with `gltf-transform simplify`, verify silhouette/normals survive) and generate a 1k-texture mobile variant.
- Self-host the Draco decoder (`useGLTF.setDecoderPath`) — currently it loads from a Google CDN at runtime.
- Audit bundle: three/drei/r3f must not be in the initial route chunk (dynamic import boundaries already exist for ModelViewer — verify with `next build` output and extend to CarTransit's canvas).
- Run Lighthouse (mobile + desktop) and fix everything below 90 except where video weight makes it impossible; document final scores in the PR.

### D. Motion & scroll feel
- Respect `prefers-reduced-motion`: disable Lenis smoothing, video scrubbing (show posters + simple fades), auto-rotate, marquees, and parallax. This is currently completely missing and is an accessibility failure.
- Navbar anchor links and hero buttons use `scrollIntoView` — route them through `window.__lenis.scrollTo(target, { duration, easing })` (the instance is already exposed) so in-page navigation matches the site's easing.
- Section pacing: F1 Act I → wipe → Act II is good; apply the same "no hard cuts" rule everywhere. Specifically: Anime → WorldBridge entry (the anime video's last frame should fade under the bridge, not pop), and FIFA → closing marquee.
- Mobile: sections currently hide the HUDs (`hidden md:block`) leaving sparse screens. Design mobile-specific compact HUDs (smaller telemetry strip, single-line scoreboard) instead of hiding them.

### E. Visual QA per section
- **F1**: video's first frame is dark/blurry — start the scrub range slightly later (`range={[0.03, 0.3]}`) after checking frames; ghost numeral "01" overlaps the intro copy at ~700px widths — clamp its size.
- **CarTransit**: while `car.glb` loads there's an empty road for a beat on slow connections — add a red light-streak placeholder that the car "arrives from". The DOM ground-shadow ellipse doesn't perfectly track the car at ultrawide aspect ratios — derive its position from the same NDC math as the car instead of a parallel percentage mapping.
- **Anime**: sakura petals `z-[5]` render over the product reveal button — drop below UI; katakana rails clip at 4k widths.
- **Exotic Cars**: the crossfade at p=0.5 between the two videos can double-expose brightly — add a 200ms dip-to-black midpoint.
- **Emirati / FIFA**: product PNG cutouts (`hoodie-emirati.png`, `hoodie-fifa.png`) have minor matte artifacts (a checkered sliver on the FIFA right sleeve) — clean up or re-cut.
- **WorldBridge**: outline name text (`WebkitTextStroke`) renders poorly on Safari < 17 — add a solid low-opacity fallback via `@supports`.

### F. Production hygiene
- Error boundaries around every `<Canvas>` with a designed 2D fallback (product PNG + copy), and a WebGL context-lost handler that shows the fallback instead of a white box.
- SEO/meta: real OpenGraph + Twitter card images (screenshot the hero), favicon set, `robots.txt`, `sitemap.xml`, canonical URL, `metadataBase`.
- Self-host fonts (Inter, Bebas Neue) with `next/font` — verify no layout shift (font-display swap flash on the display font is visible now).
- Fix the Next workspace-root warning (`turbopack.root` in `next.config.mjs`) and remove `pnpm-workspace.yaml` if unintentional.
- Cross-browser pass: Chrome, Safari (macOS + iOS), Firefox. Known risks: video scrubbing on iOS Safari (test `currentTime` seek granularity; fall back to poster-crossfade if janky), `mix-blend-overlay` on the accent wash.
- Remove `mcp-server.log`, `*.bak.*`, `PROMPT-*.md`, and any dead files from the repo; ensure `next build` is warning-free.

## Acceptance criteria

- Fresh visitor on a mid-tier laptop: loader → hero in < 3s, every scroll section plays its full choreography with no visible pop, stutter, overlap, or dead control, through to the footer.
- `prefers-reduced-motion` users get a complete, readable, non-animated experience.
- Lighthouse ≥ 90 (Perf may be lower on mobile due to video, document why), zero console errors/warnings, `getAnimations()` empty on scroll-driven elements, production build clean.
- Every fault in sections A–F above is either fixed or explicitly listed as won't-fix with a reason.

Work through A → F in order, verify each fix in a real browser before moving on, and keep a running CHANGELOG of what you touched.
