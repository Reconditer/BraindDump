import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { mediaRepository } from '@braindump/db';
/**
 * Full-resolution photo viewer.
 * Loads the main blob (not thumb) from Dexie and renders it full-width.
 * Revokes object URL on unmount.
 */
export function PhotoViewer({ mediaId }) {
    const [src, setSrc] = useState(null);
    const [error, setError] = useState(false);
    useEffect(() => {
        let objectUrl = null;
        let cancelled = false;
        void mediaRepository.get(mediaId).then((record) => {
            if (cancelled || !record) {
                setError(true);
                return;
            }
            objectUrl = URL.createObjectURL(record.data);
            setSrc(objectUrl);
        });
        return () => {
            cancelled = true;
            if (objectUrl)
                URL.revokeObjectURL(objectUrl);
        };
    }, [mediaId]);
    if (error) {
        return (_jsx("div", { className: "flex h-48 items-center justify-center rounded-lg bg-accent-soft", children: _jsx("span", { className: "text-xs text-ink-faint", children: "Foto nicht gefunden" }) }));
    }
    if (!src) {
        return (_jsx("div", { className: "h-48 animate-pulse rounded-lg bg-accent-soft/60" }));
    }
    return (_jsx("img", { src: src, alt: "", className: "w-full rounded-lg object-contain shadow-md", style: { maxHeight: '60vh' } }));
}
//# sourceMappingURL=PhotoViewer.js.map