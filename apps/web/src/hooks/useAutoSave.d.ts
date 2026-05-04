export type SaveStatus = 'idle' | 'dirty' | 'saving' | 'saved' | 'error';
/**
 * Auto-save hook. Calls `onSave(value)` debounced after the user stops typing.
 *
 * Fix: sequence counter prevents stale saves from overwriting newer content.
 * A slow save that finishes after a newer one is silently dropped.
 */
export declare function useAutoSave<T>(value: T, onSave: (value: T) => Promise<void> | void, opts?: {
    delayMs?: number;
    enabled?: boolean;
}): {
    status: SaveStatus;
    flush: () => void | undefined;
    cancel: () => void | undefined;
};
//# sourceMappingURL=useAutoSave.d.ts.map