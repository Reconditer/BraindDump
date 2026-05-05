import { useCallback, useEffect, useRef, useState } from 'react';
import { debounce, type DebouncedFunction } from '@braindump/core';

export type SaveStatus = 'idle' | 'dirty' | 'saving' | 'saved' | 'error';

/**
 * Auto-save hook. Calls `onSave(value)` debounced after the user stops typing.
 *
 * Fix: sequence counter prevents stale saves from overwriting newer content.
 * A slow save that finishes after a newer one is silently dropped.
 */
export function useAutoSave<T>(
  value: T,
  onSave: (value: T) => Promise<void> | void,
  opts: { delayMs?: number; enabled?: boolean } = {},
) {
  const { delayMs = 800, enabled = true } = opts;
  const [status, setStatus] = useState<SaveStatus>('idle');
  const onSaveRef = useRef(onSave);
  onSaveRef.current = onSave;

  // Sequence counter — only the latest save may update status.
  const seq = useRef(0);

  const debouncedRef = useRef<DebouncedFunction<[T]> | null>(null);
  if (!debouncedRef.current) {
    debouncedRef.current = debounce(async (val: T) => {
      const saveSeq = ++seq.current;
      setStatus('saving');
      try {
        await onSaveRef.current(val);
        // Only update status if no newer save has started since.
        if (saveSeq === seq.current) setStatus('saved');
      } catch (err) {
        console.error('[useAutoSave]', err);
        if (saveSeq === seq.current) setStatus('error');
      }
    }, delayMs);
  }

  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (!enabled) return;
    setStatus('dirty');
    debouncedRef.current?.(value);
  }, [value, enabled]);

  // Flush on unmount so a thought isn't lost when navigating away mid-type.
  // Cancel instead of flush when not enabled — avoids phantom saves.
  const valueRef = useRef(value);
  valueRef.current = value;
  useEffect(() => {
    return () => {
      // Only flush if there's actual content pending — empty flush deletes thoughts
      if (enabled && valueRef.current) {
        debouncedRef.current?.flush();
      } else {
        debouncedRef.current?.cancel();
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const flush = useCallback(() => debouncedRef.current?.flush(), []);
  const cancel = useCallback(() => debouncedRef.current?.cancel(), []);

  return { status, flush, cancel };
}
