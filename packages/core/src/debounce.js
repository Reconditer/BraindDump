export function debounce(fn, delayMs) {
    let timer = null;
    let lastArgs = null;
    const debounced = ((...args) => {
        lastArgs = args;
        if (timer)
            clearTimeout(timer);
        timer = setTimeout(() => {
            timer = null;
            if (lastArgs) {
                const argsToUse = lastArgs;
                lastArgs = null;
                fn(...argsToUse);
            }
        }, delayMs);
    });
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
//# sourceMappingURL=debounce.js.map