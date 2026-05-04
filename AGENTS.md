# BrainDump — Agents & Skills Übersicht

Das Arsenal für dieses Projekt. Was wir haben, was wir nutzen, wann und wofür.

## TL;DR

**Keine Custom Agents nötig.** Fast alles was wir brauchen, ist schon in installierten Plugins oder Standard-Agents verfügbar. Wir installieren gezielt 4 Plugins, decken damit Frontend, TDD, UI und Debugging ab.

---

## Bereits verfügbare Standard-Agents (ohne Installation)

| Agent | Zweck im Projekt | Wann einsetzen |
|---|---|---|
| `Plan` (Opus) | Sprint-Planung, komplexe Feature-Architektur | Vor jedem Sprint, vor neuen Screens |
| `general-purpose` | Multi-Step Research (Browser-Support, API-Recherche) | Ad-hoc bei offenen Fragen |
| `Explore` | Fast Read-only Suche im Codebase | Wenn ich eine bestimmte Stelle suche |

## Bereits installierte Plugins

### `codex@openai-codex` (schon installiert)
Second-Opinion Engine via Codex CLI.

| Tool | Einsatz |
|---|---|
| `codex:codex-rescue` (Agent) | Zweitmeinung zu Architektur, Root-Cause-Analyse, kritische Bugs |
| `codex:setup` (Skill) | Codex-Runtime prüfen |
| `codex:rescue` (Skill) | Codex-Delegation explizit triggern |

### `javascript-typescript@claude-code-workflows` (schon installiert)

**Agents:**
| Agent | Einsatz |
|---|---|
| `javascript-pro` | Async-Patterns, Web Worker (transformers.js), Event-Loop, Debouncing |
| `typescript-pro` | Dexie-Types, Zustand-Stores, Repository-Pattern, Generics |

**Skills:**
| Skill | Einsatz |
|---|---|
| `typescript-advanced-types` | W1-W2 bei Dexie-Schema, Store-Typing |
| `modern-javascript-patterns` | W1-W3 für Async/Worker/Queue-Patterns |
| `javascript-testing-patterns` | Ab W2 für Vitest-Tests der Core-Logik |
| `nodejs-backend-patterns` | Nicht gebraucht (kein Backend) |

---

## Plugins die wir noch installieren

### 1. `frontend-mobile-development`
Für React-Components, Responsive, Mobile-PWA-Patterns.

**Agents:**
- `frontend-developer` — React 19, Hooks, Performance, Component-Architektur
- `mobile-developer` — Mobile-spezifische UX-Patterns, Touch, Viewport

**Skills:**
- `react-state-management` — Zustand-Store Best Practices
- `tailwind-design-system` — Tailwind + Design-Tokens Verdrahtung
- `nextjs-app-router-patterns` — **nicht relevant** (wir nutzen Vite)
- `react-native-architecture` — **nicht relevant** (kein RN)

### 2. `ui-design`
Für Design-Token-Implementierung und Responsive.

**Agents:**
- `ui-designer` — UI-Design-Review, Visual-Konsistenz
- `design-system-architect` — Design-Token-Struktur
- `accessibility-expert` — A11y-Basics direkt mitdenken

**Skills:**
- `responsive-design` — Mobile-first, Breakpoint-Strategie
- `interaction-design` — Auto-Save-Feedback, Micro-Interactions
- `web-component-design` — Component-API Design
- `mobile-ios-design` + `mobile-android-design` — Platform-Conventions
- `visual-design-foundations` — Typography, Color, Spacing
- `design-system-patterns` — Token-Architektur

### 3. `tdd-workflows`
Für systematisches Testing der Core-Logik (Embeddings, Search).

**Agents:**
- `tdd-orchestrator` — Red-Green-Refactor Zyklus
- `code-reviewer` — Test-Coverage Review

**Commands:**
- `/tdd-cycle` — Kompletter TDD-Zyklus
- `/tdd-red` — Failing Test zuerst
- `/tdd-green` — Minimal-Implementation
- `/tdd-refactor` — Refactor bei grünen Tests

**Wann**: Core-Logik in `packages/core/` und `packages/embeddings/` — Similarity-Berechnung, Retrospective-Query-Logik, Search-Indexing.

### 4. `error-debugging`
Für tiefe Debug-Sessions wenn wir stecken.

**Agents:**
- `debugger` — Systematische Bug-Diagnose
- `error-detective` — Pattern-Erkennung in Fehlern

**Wann**: Dexie-Quota-Errors, transformers.js Worker-Probleme, PWA Service-Worker-Issues, iOS-Safari-Eigenheiten.

---

## Optionale Plugins (nur wenn wir sie brauchen)

| Plugin | Wann installieren | Warum |
|---|---|---|
| `accessibility-compliance` | Wenn a11y kritisch wird | WCAG-Audits |
| `frontend-mobile-security` | Vor Production | XSS-Scan, mobile Security |
| `code-refactoring` | Ende W3 | Refactor-Pass nach MVP |
| `git-pr-workflows` | Wenn wir mehr als Solo arbeiten | PR-Enhance |
| `comprehensive-review` | Vor Deploy | Full-Scope Review |

---

## Verfügbare Skills (vault-weit, kein Plugin nötig)

Aus dem Obsidian Vault Setup verfügbar:

| Skill | Einsatz im BrainDump-Projekt |
|---|---|
| `obsidian-markdown` | Projekt-Docs, Daily Notes, Entscheidungslogs |
| `simplify` | Nach jedem Feature-Commit → Code-Review-Pass |
| `review` | PR-Reviews vor Merge |
| `security-review` | Nach Foto-Handling (EXIF, Blob-Storage) |
| `init` | CLAUDE.md für das Repo generieren |
| `fewer-permission-prompts` | Nach W1 → Allowlist konfigurieren |
| `update-config` | Hooks oder Settings anpassen |

---

## Einsatzplan pro Phase

### Woche 1: Foundation + Text-Capture

**Aktive Agents:**
- `Plan` (Opus) — W1-Detail-Planung am Tag 1
- `typescript-pro` — Dexie-Schema, Repository-Pattern
- `javascript-pro` — Auto-Save Debounce, Async-Queue
- `frontend-developer` — React-Components, Capture-Screen
- `ui-designer` — Token-Implementierung, Aurora-Gradient

**Aktive Skills:**
- `init` — CLAUDE.md schreiben
- `obsidian-markdown` — Daily Notes führen
- `typescript-advanced-types` — Dexie-Types
- `modern-javascript-patterns` — Debounce, Async
- `tailwind-design-system` — Token-Verdrahtung
- `responsive-design` — Mobile-First
- `simplify` — nach jedem Feature

**Parallel-Strategie:**
- Tag 1: `Plan` (Opus) + `Explore` (Handoff indexieren)
- Tag 2: `typescript-pro` + `javascript-pro` parallel
- Tag 3-5: Ich code, `codex-rescue` nur bei Blocker

### Woche 2: Media + Search + Export

**Aktive Agents:**
- `frontend-developer` — Foto-UI
- `mobile-developer` — Touch-Patterns, Camera-Flow
- `javascript-pro` — Canvas-Compression, MiniSearch-Integration
- `debugger` — bei Quota-Errors
- `codex-rescue` — Second-Opinion zum Blob-Handling

**Aktive Skills:**
- `javascript-testing-patterns` — Tests für Search + Export
- `security-review` — nach Foto-Handling
- `interaction-design` — Save-Feedback
- `simplify` — durchgehend

### Woche 3: Magic Features

**Aktive Agents:**
- `javascript-pro` — Web Worker für transformers.js
- `tdd-orchestrator` — TDD für Similarity-Logik
- `typescript-pro` — Embedding-Typen
- `codex-rescue` — Zweitmeinung Worker-Architektur

**Aktive Skills:**
- `modern-javascript-patterns` — Worker-Messaging
- `/tdd-cycle` — für Cosine-Similarity Funktion
- `javascript-testing-patterns`

### Woche 4: PWA + Polish + Demo

**Aktive Agents:**
- `frontend-developer` — PWA Manifest + SW
- `accessibility-expert` — A11y-Review
- `ui-visual-validator` — Visual Regression
- `code-reviewer` — Final Review

**Aktive Skills:**
- `review` — wöchentliches Review
- `security-review` — vor Deploy
- `simplify` — letzte Politur-Runde

---

## Parallel-Patterns

**Vor kritischen Entscheidungen** (z.B. "wie bauen wir den Worker?"):
```
parallel:
  - Plan (Opus) — strategisch
  - codex-rescue — Zweitmeinung
  → ich synthetisiere
```

**Bei komplexen Bugs**:
```
parallel:
  - debugger — systematisch
  - javascript-pro — JS-Spezifika
  → ich fixe
```

**Am Wochenende**:
```
parallel:
  - review — Code-Review
  - security-review — Security-Check
  → ich mergen
```

---

## Was wir NICHT brauchen

| Nicht relevant | Warum |
|---|---|
| `claude-api` Skill | Kein Anthropic-SDK-Code |
| `nodejs-backend-patterns` Skill | Kein Backend im POC |
| `react-native-architecture` Skill | Kein React Native |
| `nextjs-app-router-patterns` Skill | Vite, nicht Next.js |
| `loop` Skill | Keine recurring Tasks |
| `defuddle` Skill | Kein Web-Scraping |
| `keybindings-help` Skill | Irrelevant |
| `obsidian-bases/cli/canvas` | Vault-Tools, nicht Code |

---

## Custom Agents: brauchen wir nicht

Ursprünglich überlegt: `braindump-design-reviewer`, `braindump-flow-validator`, `braindump-mobile-tester`.

**Warum doch nicht**:
- `ui-designer` + `design-system-architect` decken Design-Review
- `codex-rescue` mit gutem Prompt deckt Flow-Validation
- `mobile-developer` + `accessibility-expert` decken Device-Tests
- Jedes Projekt eigene Agents zu bauen ist Overhead. Ich briefe die Standard-Agents gut.

**Wenn sich das ändert**: Wir legen welche an unter `~/project/braindump/.claude/agents/`.

---

## Installation der zusätzlichen Plugins

```
/plugin install frontend-mobile-development@claude-code-workflows
/plugin install ui-design@claude-code-workflows
/plugin install tdd-workflows@claude-code-workflows
/plugin install error-debugging@claude-code-workflows
```

Nach der Installation sind alle oben genannten Agents und Skills verfügbar.

---

## Kernregel beim Einsatz

> **Verwende einen Agent wenn er echten Mehrwert bringt.** Nicht jedes Feature braucht einen Subagent. Für die meisten Implementierungen reicht der Haupt-Claude direkt. Agents sind für:
> - Zweitmeinungen bei kritischen Architektur-Fragen
> - Tiefe Recherche die mein Context verstopft
> - Parallelisierung wenn wirklich unabhängige Arbeit
> - Spezialisiertes Expertenwissen (a11y, security, TDD)
