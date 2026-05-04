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

export function debounce<Args extends unknown[]>(
  fn: (...args: Args) => void,
  delayMs: number,
): DebouncedFunction<Args> {
  let timer: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: Args | null = null;

  const debounced = ((...args: Args) => {
    lastArgs = args;
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      if (lastArgs) {
        const argsToUse = lastArgs;
        lastArgs = null;
        fn(...argsToUse);
      }
    }, delayMs);
  }) as DebouncedFunction<Args>;

  debounced.flush = () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    if (lastArgs) {
      const argsToUse = lastArgs;
      lastArgs = null;
      fn(...argsToUse);
    }
  };

  debounced.cancel = () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    lastArgs = null;
  };

  return debounced;
}
