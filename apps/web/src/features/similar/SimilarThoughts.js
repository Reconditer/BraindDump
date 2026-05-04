import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { thoughtPreview } from '@braindump/core';
import { thoughtRepository } from '@braindump/db';
import { embeddingService, cosineSimilarity } from './embedding-service';
import { addToIndex } from '../search/search-index';
// UX-Standard: Schwelle auf 0.55 angehoben (0.4 zu niedrig für MiniLM).
// Min. 2 Treffer nötig, sonst Section ganz verstecken (still = gut).
const MIN_SIMILARITY = 0.55;
const MIN_RESULTS = 2;
const TOP_K = 3;
/**
 * Magic #2: Ähnliche Gedanken.
 * Shown in the detail view below the thought text.
 *
 * On mount:
 * 1. Embed the current thought (or use cached embedding).
 * 2. Load all other thoughts with embeddings from Dexie.
 * 3. Compute cosine similarity, return top K > MIN_SIMILARITY.
 */
export function SimilarThoughts({ thought }) {
    const [results, setResults] = useState([]);
    const [status, setStatus] = useState('loading');
    useEffect(() => {
        let cancelled = false;
        async function run() {
            const text = thought.content.trim();
            if (!text || text.length < 20) {
                setStatus('empty');
                return;
            }
            // Get embedding for current thought
            let embedding = thought.embedding ?? null;
            if (!embedding) {
                embedding = await embeddingService.embed(text);
                if (!embedding) {
                    setStatus('unavailable');
                    return;
                }
                // Persist embedding so future lookups are instant
                const updated = { ...thought, embedding };
                await thoughtRepository.save(updated);
                addToIndex(updated);
            }
            // Load all thoughts that have embeddings
            const all = await thoughtRepository.listNewestFirst(500);
            const candidates = all.filter((t) => t.id !== thought.id && t.embedding && t.embedding.length > 0);
            if (candidates.length === 0) {
                setStatus('empty');
                return;
            }
            // Score + sort
            const scored = candidates
                .map((t) => ({
                thought: t,
                score: cosineSimilarity(embedding, t.embedding),
            }))
                .filter((r) => r.score >= MIN_SIMILARITY)
                .sort((a, b) => b.score - a.score)
                .slice(0, TOP_K);
            if (!cancelled) {
                // UX-Standard: Section nur zeigen wenn >= MIN_RESULTS
                if (scored.length >= MIN_RESULTS) {
                    setResults(scored);
                    setStatus('ready');
                }
                else {
                    setStatus('empty');
                }
            }
        }
        void run();
        return () => { cancelled = true; };
    }, [thought.id]);
    if (status === 'loading') {
        // UX-Standard: nicht blockierend, dezente Progress-Line
        const isColdStart = !embeddingService.isReady();
        return (_jsxs("div", { className: "mt-6 flex items-center gap-2 text-xs text-ink-faint", children: [_jsx("span", { className: "inline-block h-px w-8 animate-pulse bg-accent-deep/40" }), _jsx("span", { children: isColdStart ? 'ähnliche gedanken werden vorbereitet…' : 'suche läuft…' })] }));
    }
    if (status === 'unavailable' || status === 'empty')
        return null;
    return (_jsxs("div", { className: "mt-8", children: [_jsxs("div", { className: "mb-3 flex items-center gap-2", children: [_jsx("span", { className: "text-accent-deep", children: "\u2726" }), _jsx("span", { className: "text-[10px] font-semibold uppercase tracking-widest text-accent-deep", children: "\u00C4hnliche Gedanken" }), _jsx("span", { className: "h-px flex-1 bg-rule" })] }), _jsx("div", { className: "flex flex-col gap-2", children: results.map(({ thought: t, score }) => (_jsxs(Link, { to: `/thought/${t.id}`, className: "block rounded-lg bg-white/60 p-3 shadow-sm backdrop-blur-sm transition hover:bg-white", children: [_jsxs("div", { className: "mb-1 flex items-center justify-between", children: [_jsx("span", { className: "text-[10px] font-semibold uppercase tracking-widest text-accent-deep", children: new Date(t.createdAt).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: '2-digit' }) }), _jsxs("span", { className: "rounded-pill bg-accent-soft px-2 py-0.5 text-[10px] font-semibold text-accent-deep", children: [Math.round(score * 100), "%"] })] }), _jsx("p", { className: "text-sm leading-snug text-ink", children: thoughtPreview(t, 100) })] }, t.id))) })] }));
}
//# sourceMappingURL=SimilarThoughts.js.map