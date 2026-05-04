import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { thoughtRepository } from '@braindump/db';
import { debounce } from '@braindump/core';
import { hydrateSearchIndex, addToIndex, searchThoughts, } from './search-index';
/**
 * Fixes:
 * - WICHTIG: debounced search is cancelled on unmount
 * - WICHTIG: index stays in sync — every live-query update calls addToIndex
 *   for changed/new thoughts so search results are never stale
 */
export function SearchBar({ onResults }) {
    const [query, setQuery] = useState('');
    const [indexReady, setIndexReady] = useState(false);
    const thoughts = useLiveQuery(() => thoughtRepository.listNewestFirst(500), [], []);
    // Hydrate on first load; keep index in sync on every subsequent update
    useEffect(() => {
        if (thoughts.length === 0)
            return;
        if (!indexReady) {
            void hydrateSearchIndex(thoughts).then(() => setIndexReady(true));
        }
        else {
            // Incremental sync: re-add all thoughts (MiniSearch discards before re-adding)
            thoughts.forEach((t) => addToIndex(t));
        }
    }, [thoughts, indexReady]);
    const debouncedSearch = useMemo(() => debounce((q) => {
        if (!q.trim()) {
            onResults(null);
            return;
        }
        const results = searchThoughts(q);
        onResults(results.map((r) => r.id));
    }, 250), 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []);
    // WICHTIG FIX: cancel on unmount so onResults is never called after teardown
    useEffect(() => {
        return () => debouncedSearch.cancel();
    }, [debouncedSearch]);
    const handleChange = (e) => {
        const val = e.target.value;
        setQuery(val);
        debouncedSearch(val);
    };
    const handleClear = () => {
        setQuery('');
        onResults(null);
    };
    return (_jsxs("div", { className: "relative flex items-center", children: [_jsx(SearchIcon, {}), _jsx("input", { type: "search", value: query, onChange: handleChange, placeholder: "suchen\u2026", className: "w-full rounded-pill bg-white/60 py-2 pl-8 pr-8 text-sm text-ink placeholder:text-ink-faint focus:bg-white focus:outline-none focus:ring-1 focus:ring-accent/40" }), query && (_jsx("button", { type: "button", onClick: handleClear, "aria-label": "Suche l\u00F6schen", className: "absolute right-2 text-ink-faint hover:text-ink", children: _jsx(XIcon, {}) }))] }));
}
function SearchIcon() {
    return (_jsxs("svg", { className: "absolute left-2.5 text-ink-faint", width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", children: [_jsx("circle", { cx: "10.5", cy: "10.5", r: "6.5" }), _jsx("path", { d: "M19 19l-4-4" })] }));
}
function XIcon() {
    return (_jsx("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", children: _jsx("path", { d: "M18 6L6 18M6 6l12 12" }) }));
}
//# sourceMappingURL=SearchBar.js.map