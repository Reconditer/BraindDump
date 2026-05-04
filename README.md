# BrainDump

> Eine App für rohe Gedanken. Kein Tag, kein Ordner, keine Einrichtung.

Web-PWA, läuft im Browser auf Handy und Laptop. Local-first via Dexie (IndexedDB).
Kein Backend, kein Account. Später → Deploy via Railway als Static Host.

## Stack

- React 18 + TypeScript + Vite
- Tailwind 3 + CSS Custom Properties
- Dexie 4 (IndexedDB) + dexie-react-hooks
- React Router 6
- @tanstack/react-virtual für die Timeline
- vite-plugin-pwa für Manifest + Service Worker

## Struktur

```
braindump/
├── AGENTS.md                   Agents/Skills/Plugins Übersicht
├── apps/
│   └── web/                    Vite + React + PWA
├── packages/
│   ├── core/                   Domain-Logik (Thought, debounce, id)
│   ├── db/                     Dexie Repositories
│   └── design-tokens/          CSS Variablen + Tailwind Preset
├── pnpm-workspace.yaml
├── turbo.json
└── tsconfig.base.json
```

## Entwicklung

```bash
pnpm install
pnpm dev
```

App läuft auf `http://localhost:5173`.

Mobile-Test im lokalen Netzwerk: Vite startet mit `host: true`, also von anderen
Geräten im WLAN über `http://<deine-ip>:5173` erreichbar.

## Roadmap

Siehe `[[02 Projekte/BrainDump.md]]` im Obsidian Vault.

Kurz:
- ✅ Woche 1: Foundation + Text-Capture + Timeline + Detail + Auto-Save
- ⏳ Woche 2: Foto-Capture + Suche (MiniSearch) + Export JSON/ZIP + Settings
- ⏳ Woche 3: Magic Features — Rückblick (Zero-AI) + Ähnliche Gedanken (transformers.js on-device)
- ⏳ Woche 4: PWA Polish + Real-Device-Tests + Railway Deploy

## Prinzipien

1. Capture-Friktion gegen Null
2. Auto-Save statt Speichern-Button
3. Local-First, aber Export als Vertrauens-Anker
4. Magic ist sichtbar (Rückblick + Ähnliche Gedanken)
5. Alles editierbar, alles löschbar, alles exportierbar
