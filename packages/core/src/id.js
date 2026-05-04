/**
 * Generates a short, sortable unique ID.
 * Uses crypto.randomUUID where available, else falls back to a timestamp + random hex.
 */
export function generateId() {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
        return crypto.randomUUID();
    }
    const time = Date.now().toString(36);
    const rand = Math.random().toString(36).slice(2, 10);
    return `${time}-${rand}`;
}
//# sourceMappingURL=id.js.map