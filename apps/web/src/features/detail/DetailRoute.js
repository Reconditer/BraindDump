import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { thoughtRepository } from '@braindump/db';
import { useAutoSave } from '@/hooks/useAutoSave';
import { SaveStatusIndicator } from '../capture/SaveStatusIndicator';
import { formatRelativeDate } from '../timeline/format-date';
import { SimilarThoughts } from '../similar/SimilarThoughts';
import { PhotoViewer } from '../photo/PhotoViewer';
/**
 * BLOCKER FIX: track `initializedId` keyed by thought.id
 * so navigating from /thought/a to /thought/b correctly resets content.
 */
export function DetailRoute() {
    const { id } = useParams();
    const navigate = useNavigate();
    const thought = useLiveQuery(() => (id ? thoughtRepository.get(id).then((t) => t ?? null) : null), [id]);
    const [content, setContent] = useState('');
    const [initializedId, setInitializedId] = useState(null);
    useEffect(() => {
        if (thought && initializedId !== thought.id) {
            setContent(thought.content);
            setInitializedId(thought.id);
        }
    }, [thought, initializedId]);
    const enabled = initializedId === thought?.id;
    const { status } = useAutoSave(content, async (val) => {
        if (!thought)
            return;
        if (!val.trim()) {
            await thoughtRepository.remove(thought.id);
            navigate('/timeline');
            return;
        }
        await thoughtRepository.save({ ...thought, content: val });
    }, { delayMs: 800, enabled });
    // still loading
    if (thought === undefined)
        return null;
    if (thought === null) {
        return (_jsx("div", { className: "flex flex-1 items-center justify-center", children: _jsx("p", { className: "text-sm text-ink-faint", children: "Gedanke nicht gefunden." }) }));
    }
    return (_jsxs("div", { className: "flex flex-1 flex-col", children: [_jsxs("header", { className: "flex items-center justify-between px-5 pt-4 pb-2 desktop:px-8 desktop:pt-6", children: [_jsx(Link, { to: "/timeline", className: "text-xs font-semibold uppercase tracking-widest text-ink-faint transition hover:text-ink-soft", children: "\u2190 zur\u00FCck" }), _jsx(SaveStatusIndicator, { status: status })] }), _jsx("div", { className: "px-5 pb-2 desktop:px-8", children: _jsx("div", { className: "text-[10px] font-semibold uppercase tracking-widest text-accent-deep", children: formatRelativeDate(thought.createdAt) }) }), _jsxs("main", { className: "flex flex-1 flex-col px-5 pb-10 tab-bar-offset desktop:px-8 desktop:pb-10", style: { paddingBottom: undefined }, children: [thought.type === 'photo' && thought.mediaId && (_jsx("div", { className: "mb-4", children: _jsx(PhotoViewer, { mediaId: thought.mediaId }) })), _jsx("textarea", { value: content, onChange: (e) => setContent(e.target.value), placeholder: "schreib los.", className: "flex-1 resize-none bg-transparent text-lg leading-relaxed text-ink placeholder:text-ink-very-faint focus:outline-none desktop:text-xl", spellCheck: true }), _jsx("button", { type: "button", onClick: async () => {
                            // Haptik bei destruktiver Action
                            try {
                                navigator.vibrate?.(10);
                            }
                            catch { /* ignore */ }
                            if (confirm('diesen gedanken löschen?')) {
                                try {
                                    navigator.vibrate?.([10, 50, 10]);
                                }
                                catch { /* ignore */ }
                                await thoughtRepository.remove(thought.id);
                                navigate('/timeline');
                            }
                        }, className: "mt-4 flex min-h-[44px] items-center self-start rounded-pill px-3 text-xs font-semibold uppercase tracking-widest text-ink-faint transition hover:text-pink", "aria-label": "Gedanken l\u00F6schen", children: "l\u00F6schen" }), _jsx(SimilarThoughts, { thought: thought })] })] }));
}
//# sourceMappingURL=DetailRoute.js.map