import { useCallback, useEffect, useRef, useState } from 'react';
import { debounce } from '@braindump/core';
/**
 * Auto-save hook. Calls `onSave(value)` debounced after the user stops typing.
 *
 * Fix: sequence counter prevents stale saves from overwriting newer content.
 * A slow save that finishes after a newer one is silently dropped.
 */
export function useAutoSave(value, onSave, opts = {}) {
    const { delayMs = 800, enabled = true } = opts;
    const [status, setStatus] = useState('idle');
    const onSaveRef = useRef(onSave);
    onSaveRef.current = onSave;
    // Sequence counter — only the latest save may update status.
    const seq = useRef(0);
    const debouncedRef = useRef(null);
    if (!debouncedRef.current) {
        debouncedRef.current = debounce(async (val) => {
            const saveSeq = ++seq.current;
            setStatus('saving');
            try {
                await onSaveRef.current(val);
                // Only update status if no newer save has started since.
                if (saveSeq === seq.current)
                    setStatus('saved');
            }
            catch (err) {
                console.error('[useAutoSave]', err);
                if (saveSeq === seq.current)
                    setStatus('error');
            }
        }, delayMs);
    }
    const firstRender = useRef(true);
    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
            return;
        }
        if (!enabled)
            return;
        setStatus('dirty');
        debouncedRef.current?.(value);
    }, [value, enabled]);
    // Flush on unmount so a thought isn't lost when navigating away mid-type.
    useEffect(() => {
        return () => {
            debouncedRef.current?.flush();
        };
    }, []);
    const flush = useCallback(() => debouncedRef.current?.flush(), []);
    const cancel = useCallback(() => debouncedRef.current?.cancel(), []);
    return { status, flush, cancel };
}
//# sourceMappingURL=useAutoSave.js.map