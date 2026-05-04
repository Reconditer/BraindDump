import MiniSearch from 'minisearch';
/**
 * Singleton MiniSearch index.
 * Built lazily from Dexie on first search, kept in memory.
 * Updated incrementally on every save/delete.
 */
const index = new MiniSearch({
    idField: 'id',
    fields: ['content'],
    storeFields: ['id', 'type', 'mediaId', 'createdAt'],
    searchOptions: {
        prefix: true,
        fuzzy: 0.2,
        boost: { content: 2 },
    },
});
let hydrated = false;
export async function hydrateSearchIndex(thoughts) {
    if (hydrated)
        return;
    index.addAll(thoughts);
    hydrated = true;
}
export function addToIndex(thought) {
    // MiniSearch throws if id already exists → discard first
    try {
        index.discard(thought.id);
    }
    catch { /* not in index yet */ }
    index.add(thought);
}
export function removeFromIndex(id) {
    try {
        index.discard(id);
    }
    catch { /* already gone */ }
}
export function searchThoughts(query) {
    if (!query.trim())
        return [];
    return index.search(query).map((r) => ({ id: r.id, score: r.score }));
}
//# sourceMappingURL=search-index.js.map