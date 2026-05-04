import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { useVirtualizer } from '@tanstack/react-virtual';
import { thoughtRepository } from '@braindump/db';
import { thoughtPreview } from '@braindump/core';
import { formatRelativeDate } from './format-date';
import { PhotoThumb } from '../photo/PhotoThumb';
import { SearchBar } from '../search/SearchBar';
import { RetrospectiveCard } from '../retrospective/RetrospectiveCard';
// UX-Standard: Haptik-Helper (sparsam — nur destruktive Actions)
function vibrate(pattern) {
    try {
        navigator.vibrate?.(pattern);
    }
    catch { /* ignore in unsupported env */ }
}
export function TimelineRoute() {
    const allThoughts = useLiveQuery(() => thoughtRepository.listNewestFirst(500), [], []);
    const [searchResultIds, setSearchResultIds] = useState(null);
    // UX-Standard: Undo-Toast (5s, dann endgültig löschen)
    const [undoEntry, setUndoEntry] = useState(null);
    const handleDelete = useCallback((thought) => {
        // Haptik: kurze Vibration beim Delete-Reveal commit
        vibrate(10);
        // Vorheriger Undo-Timer abbrechen + sofort löschen wenn neuer kommt
        if (undoEntry) {
            clearTimeout(undoEntry.timer);
            void thoughtRepository.remove(undoEntry.thought.id);
        }
        // Optimistisch aus DB entfernen (LiveQuery updated die Liste)
        void thoughtRepository.remove(thought.id);
        const timer = setTimeout(() => {
            setUndoEntry(null);
        }, 5000);
        setUndoEntry({ thought, timer });
    }, [undoEntry]);
    const handleUndo = useCallback(() => {
        if (!undoEntry)
            return;
        clearTimeout(undoEntry.timer);
        vibrate([10, 50, 10]);
        void thoughtRepository.save(undoEntry.thought);
        setUndoEntry(null);
    }, [undoEntry]);
    // Cleanup beim Unmount
    useEffect(() => {
        return () => {
            if (undoEntry)
                clearTimeout(undoEntry.timer);
        };
    }, [undoEntry]);
    // Filter + re-sort by search score when search is active
    const thoughts = useMemo(() => {
        if (searchResultIds === null)
            return allThoughts;
        // NICE FIX: preserve relevance order from MiniSearch (best match first)
        const idIndex = new Map(searchResultIds.map((id, i) => [id, i]));
        return allThoughts
            .filter((t) => idIndex.has(t.id))
            .sort((a, b) => (idIndex.get(a.id) ?? 999) - (idIndex.get(b.id) ?? 999));
    }, [allThoughts, searchResultIds]);
    const parentRef = useRef(null);
    const rowVirtualizer = useVirtualizer({
        count: thoughts.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 88,
        overscan: 6,
    });
    return (_jsxs("div", { className: "flex flex-1 flex-col", children: [undoEntry && (_jsxs("div", { className: "bd-fade-in fixed bottom-24 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-pill px-4 py-2.5 shadow-lg", style: { background: 'rgba(42,33,56,0.88)', backdropFilter: 'blur(12px)' }, role: "status", "aria-live": "polite", children: [_jsx("span", { className: "text-xs font-medium text-white", children: "Gedanke gel\u00F6scht" }), _jsx("button", { type: "button", onClick: handleUndo, className: "min-h-[44px] min-w-[44px] text-xs font-bold text-accent", style: { color: 'var(--bd-accent)' }, children: "R\u00FCckg\u00E4ngig" })] })), _jsxs("header", { className: "flex items-center justify-between px-5 pt-4 pb-3 desktop:px-8 desktop:pt-6", children: [_jsx(Link, { to: "/", className: "text-xs font-semibold uppercase tracking-widest text-ink-faint transition hover:text-ink-soft", children: "\u2190 schreiben" }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsxs("span", { className: "text-xs font-semibold uppercase tracking-widest text-ink-faint", children: [allThoughts.length, " gedanke", allThoughts.length === 1 ? '' : 'n'] }), _jsx(Link, { to: "/settings", className: "text-xs font-semibold uppercase tracking-widest text-ink-faint transition hover:text-ink-soft", "aria-label": "Einstellungen", children: "\u00B7\u00B7\u00B7" })] })] }), _jsx("div", { className: "px-5 pb-3 desktop:px-8", children: _jsx(SearchBar, { onResults: setSearchResultIds }) }), searchResultIds === null && allThoughts.length > 0 && (_jsx("div", { className: "px-5 pb-2 desktop:px-8", children: _jsx(RetrospectiveCard, { thoughts: allThoughts }) })), thoughts.length === 0 ? (_jsx(EmptyState, { isSearch: searchResultIds !== null })) : (_jsx("div", { ref: parentRef, className: "flex-1 overflow-auto px-3 pb-6 tab-bar-offset desktop:px-6", role: "list", "aria-label": "Gedanken", children: _jsx("div", { style: { height: `${rowVirtualizer.getTotalSize()}px`, position: 'relative', width: '100%' }, children: rowVirtualizer.getVirtualItems().map((virtualRow) => {
                        const thought = thoughts[virtualRow.index];
                        if (!thought)
                            return null;
                        return (_jsx("div", { "data-index": virtualRow.index, ref: rowVirtualizer.measureElement, role: "listitem", style: {
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                transform: `translateY(${virtualRow.start}px)`,
                            }, children: _jsx(SwipeRow, { thought: thought, onDelete: handleDelete }) }, thought.id));
                    }) }) }))] }));
}
/**
 * UX-Standard: Swipe-Delete mit min. 40% Kartenbreite + Reveal-Button.
 * Nicht direkt löschen bei kurzem Swipe (iOS Mail Pattern).
 */
function SwipeRow({ thought, onDelete }) {
    const [offset, setOffset] = useState(0);
    const [revealed, setRevealed] = useState(false);
    const startXRef = useRef(0);
    const containerRef = useRef(null);
    const REVEAL_THRESHOLD = 0.4; // 40% of card width
    const handleTouchStart = (e) => {
        startXRef.current = e.touches[0].clientX;
        setRevealed(false);
    };
    const handleTouchMove = (e) => {
        const dx = startXRef.current - e.touches[0].clientX;
        if (dx < 0) {
            setOffset(0);
            return;
        } // no right-swipe
        const width = containerRef.current?.offsetWidth ?? 300;
        const clamped = Math.min(dx, width * 0.55); // max 55%
        setOffset(clamped);
        if (dx >= width * REVEAL_THRESHOLD) {
            // Haptik beim Erreichen des Schwellwerts
            if (!revealed)
                vibrate(8);
            setRevealed(true);
        }
        else {
            setRevealed(false);
        }
    };
    const handleTouchEnd = () => {
        if (!revealed) {
            // Zu kurz — zurücksnappen
            setOffset(0);
        }
        // Wenn revealed: Delete-Button bleibt sichtbar bis User tippt oder woanders hin
    };
    const handleDeleteClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setOffset(0);
        setRevealed(false);
        onDelete(thought);
    };
    return (_jsxs("div", { ref: containerRef, className: "relative mx-2 my-1.5 overflow-hidden rounded-lg", children: [_jsx("div", { className: "absolute inset-y-0 right-0 flex items-center justify-end rounded-lg pr-4", style: { background: 'var(--bd-pink)', minWidth: 72 }, "aria-hidden": !revealed, children: _jsx("button", { type: "button", onClick: handleDeleteClick, "aria-label": `${thoughtPreview(thought, 30)} löschen`, className: "flex h-[44px] w-[44px] items-center justify-center text-white", children: _jsx(TrashIcon, {}) }) }), _jsx("div", { style: {
                    transform: `translateX(-${offset}px)`,
                    transition: offset === 0 ? 'transform 280ms cubic-bezier(0.25,0.46,0.45,0.94)' : 'none',
                    willChange: 'transform',
                }, onTouchStart: handleTouchStart, onTouchMove: handleTouchMove, onTouchEnd: handleTouchEnd, children: _jsx(ThoughtRow, { thought: thought }) })] }));
}
function ThoughtRow({ thought }) {
    return (_jsxs(Link, { to: `/thought/${thought.id}`, className: "flex items-start gap-3 rounded-lg bg-white/75 p-4 shadow-sm backdrop-blur-sm transition hover:bg-white hover:shadow-md", children: [thought.type === 'photo' && thought.mediaId && (_jsx(PhotoThumb, { mediaId: thought.mediaId, size: 48, className: "mt-0.5 shrink-0" })), _jsxs("div", { className: "min-w-0 flex-1", children: [_jsx("div", { className: "mb-1 text-[10px] font-semibold uppercase tracking-widest text-accent-deep", children: formatRelativeDate(thought.createdAt) }), _jsx("div", { className: "truncate text-sm leading-snug text-ink", children: thoughtPreview(thought, 120) })] })] }));
}
function TrashIcon() {
    return (_jsxs("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [_jsx("polyline", { points: "3 6 5 6 21 6" }), _jsx("path", { d: "M19 6l-1 14H6L5 6" }), _jsx("path", { d: "M10 11v6M14 11v6" }), _jsx("path", { d: "M9 6V4h6v2" })] }));
}
function EmptyState({ isSearch }) {
    return (_jsx("div", { className: "flex flex-1 items-center justify-center px-6 pb-16 text-center", children: isSearch ? (
        // UX-Standard: hilfreicher Hinweis statt nur "keine treffer"
        _jsxs("div", { className: "flex flex-col gap-1", children: [_jsx("p", { className: "text-sm text-ink-faint", children: "nichts gefunden." }), _jsx("p", { className: "text-xs text-ink-very-faint", children: "versuch einzelne W\u00F6rter statt S\u00E4tze." })] })) : (
        // UX-Standard: warm + einladend, nicht technisch
        _jsxs("p", { className: "text-sm text-ink-faint", children: ["schreib was neues,", ' ', _jsx(Link, { to: "/", className: "text-accent-deep underline decoration-accent/50 underline-offset-4", children: "wir vergessen nichts." })] })) }));
}
//# sourceMappingURL=TimelineRoute.js.map