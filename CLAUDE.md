# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

All commands run from the repo root unless noted.

```bash
# Install dependencies (required after clone or adding packages)
pnpm install

# Start dev server (http://localhost:5173, also available on LAN via host IP)
pnpm dev
# or directly:
cd apps/web && pnpm dev

# Typecheck (runs tsc --noEmit across all packages)
pnpm typecheck
# or for the web app only:
cd apps/web && pnpm typecheck

# Production build
pnpm build

# Add a dependency to the web app
cd apps/web && pnpm add <package>

# Add a dev dependency to a package
cd packages/core && pnpm add -D <package>
```

There are no tests yet. The plan is `vitest` + `@testing-library/react` when coverage is needed.

## Architecture

### Monorepo layout

```
apps/web/          React 18 + Vite + Tailwind — the only deployable app
packages/core/     Domain types + pure utilities (Thought, debounce, id generation)
packages/db/       Dexie repositories — all IndexedDB access goes here
packages/design-tokens/  CSS custom properties + Tailwind preset
```

Packages are referenced as workspace deps (`@braindump/core`, `@braindump/db`, `@braindump/design-tokens`). Vite resolves them directly from source; there is no build step for packages.

### Data layer

Everything is local-first. There is no backend or auth in the POC.

- **`packages/db/src/db.ts`** — single Dexie instance (`braindump` IndexedDB database, schema v1)
- Two tables: `thoughts` (indexed on `createdAt, updatedAt, type`) and `media` (blobs kept separate to keep Thought rows small)
- **`ThoughtRepository`** is the only write path for thoughts. It handles cascade deletes (removes the associated `media` blob in a single Dexie transaction when a photo thought is deleted)
- **`MediaRepository`** stores compressed JPEG blobs + 200 px square thumbnails
- `Thought.embedding` stores a `number[]` (384-dim float) after the on-device model runs

### Embedding pipeline

Embeddings run entirely on-device via a Web Worker — no API key, no network call.

- `apps/web/src/workers/embedding.worker.ts` — loads `Xenova/all-MiniLM-L6-v2` (~22 MB, quantized) via `@xenova/transformers`, exposes a message protocol: `{ type: 'embed', id, text }` → `{ type: 'result', id, embedding }`
- `apps/web/src/features/similar/embedding-service.ts` — singleton that owns the Worker, serialises requests by pending Map keyed on a random ID, and resolves them with null on Worker error so callers never hang
- `@xenova/transformers` is excluded from Vite's `optimizeDeps` (top-level await + WASM)

### Search

MiniSearch is hydrated lazily from Dexie on first keystroke and kept in sync via `addToIndex` called after every live-query update in `SearchBar`. Results are returned as ordered IDs (best match first); the Timeline sorts by this order when search is active.

### Auto-save pattern

`useAutoSave` (in `apps/web/src/hooks/`) debounces writes at 800 ms. A sequence counter (`seq.current`) ensures that a slow, stale save cannot overwrite content written by a later, faster save. The hook flushes on unmount so navigation never drops in-flight text.

### Design tokens

All colours, fonts, radii, and shadows are defined once in `packages/design-tokens/src/tokens.css` as CSS custom properties (prefix `--bd-*`). The Tailwind preset at `packages/design-tokens/src/tailwind.preset.js` maps them into Tailwind utility classes (`text-accent-deep`, `bg-grad-bg`, `rounded-pill`, etc.). Never hardcode hex values in components.

### Layout rule

The app is mobile-first. On desktop (`≥ 768 px`) content is constrained to `max-w-content` (840 px, defined in tokens) and centred — the Aurora gradient never full-bleeds a wide monitor.

### Schema migrations

To add a new IndexedDB table or index, add a new `this.version(N).stores({...})` block in `packages/db/src/db.ts`. Do not modify existing version blocks.

### PWA

`vite-plugin-pwa` (Workbox) is configured in `apps/web/vite.config.ts`. The Service Worker is disabled in dev (`devOptions.enabled: false`). PWA manifest icons are at `apps/web/public/icon-{192,512}.png`. The `InstallBanner` component handles iOS (Share → Home Screen instructions) and Android/Desktop (`beforeinstallprompt`) install flows.
