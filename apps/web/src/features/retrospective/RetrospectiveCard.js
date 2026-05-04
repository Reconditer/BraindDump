import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { thoughtPreview } from '@braindump/core';
// UX-Standard: Erst ab Tag 7 anzeigen — vorher ist das Versprechen leer.
const LOOKBACK_DAYS = [7, 14, 30, 365];
const MIN_APP_AGE_DAYS = 7;
/**
 * Magic #1: Rückblick — zero AI, pure date query.
 *
 * Fixes:
 * - WICHTIG: localStorage wrapped in try/catch for restricted/private contexts
 * - WICHTIG: date matching uses local calendar days, not ms arithmetic,
 *   so DST transitions and time-of-day differences don't cause misses
 */
export function RetrospectiveCard({ thoughts }) {
    const todayKey = new Date().toISOString().slice(0, 10);
    const storageKey = `bd-retro-dismissed-${todayKey}`;
    const [dismissed, setDismissed] = useState(() => {
        try {
            return localStorage.getItem(storageKey) === '1';
        }
        catch {
            return false;
        }
    });
    const match = useMemo(() => findRetroThought(thoughts), [thoughts]);
    // UX-Standard: erst ab Tag 7 anzeigen (Versprechen hält nur wenn was da ist)
    const appOldEnough = useMemo(() => {
        if (thoughts.length === 0)
            return false;
        const oldest = Math.min(...thoughts.map((t) => t.createdAt));
        const ageMs = Date.now() - oldest;
        return ageMs >= MIN_APP_AGE_DAYS * 24 * 60 * 60 * 1000;
    }, [thoughts]);
    if (!match || dismissed || !appOldEnough)
        return null;
    const { thought, daysAgo } = match;
    const dismiss = () => {
        try {
            localStorage.setItem(storageKey, '1');
        }
        catch { /* ignore */ }
        setDismissed(true);
    };
    return (
    // UX-Standard: eigener visueller Stil — Gradient-Tint, Fraunces-Label, klar als Rückblick erkennbar
    _jsxs("div", { className: "bd-fade-in relative overflow-hidden rounded-lg px-4 py-3.5 shadow-sm backdrop-blur-sm", style: { background: 'linear-gradient(135deg, rgba(234,217,255,0.55), rgba(207,229,255,0.45))' }, children: [_jsx("div", { className: "absolute left-0 top-0 h-full w-1 rounded-l-lg bg-grad-accent" }), _jsxs("div", { className: "pl-3", children: [_jsxs("div", { className: "mb-1.5 flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(RetroIcon, {}), _jsx("span", { className: "bd-meta text-accent-deep", children: "R\u00FCckblick" }), _jsxs("span", { className: "bd-meta text-ink-faint", children: ["\u00B7 vor ", daysAgo === 365 ? 'einem Jahr' : `${daysAgo} Tagen`] })] }), _jsx("button", { type: "button", onClick: dismiss, "aria-label": "R\u00FCckblick schlie\u00DFen", className: "flex h-[44px] w-[44px] items-center justify-center text-ink-faint transition hover:text-ink-soft", children: _jsx(XSmallIcon, {}) })] }), _jsx(Link, { to: `/thought/${thought.id}`, className: "block leading-snug text-ink hover:text-accent-deep", children: _jsxs("span", { className: "bd-display-italic text-[15px] text-ink", children: ["\"", thoughtPreview(thought, 160), "\""] }) })] })] }));
}
/**
 * WICHTIG FIX: compare local calendar dates instead of ms distance.
 * This prevents DST and time-of-day differences from breaking matches.
 */
function findRetroThought(thoughts) {
    const today = localDateStr(new Date());
    for (const days of LOOKBACK_DAYS) {
        const target = new Date();
        target.setDate(target.getDate() - days);
        const targetStr = localDateStr(target);
        const found = thoughts.find((t) => localDateStr(new Date(t.createdAt)) === targetStr);
        if (found)
            return { thought: found, daysAgo: days };
    }
    return null;
}
/** Returns YYYY-MM-DD in local time */
function localDateStr(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
}
function XSmallIcon() {
    return (_jsx("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", children: _jsx("path", { d: "M18 6L6 18M6 6l12 12" }) }));
}
function RetroIcon() {
    return (_jsxs("svg", { width: "12", height: "12", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: [_jsx("circle", { cx: "12", cy: "12", r: "9" }), _jsx("path", { d: "M12 7v5l3 3" }), _jsx("path", { d: "M7.5 4.5 6 3M16.5 4.5 18 3" })] }));
}
//# sourceMappingURL=RetrospectiveCard.js.map