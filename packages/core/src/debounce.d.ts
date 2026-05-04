/**
 * Typed debounce helper.
 * - `flush()` runs the pending call immediately.
 * - `cancel()` drops the pending call.
 */
export interface DebouncedFunction<Args extends unknown[]> {
    (...args: Args): void;
    flush(): void;
    cancel(): void;
}
export declare function debounce<Args extends unknown[]>(fn: (...args: Args) => void, delayMs: number): DebouncedFunction<Args>;
//# sourceMappingURL=debounce.d.ts.map