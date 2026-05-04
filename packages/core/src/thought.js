import { generateId } from './id.js';
export function createThoughtDraft(input = {}) {
    return {
        content: input.content ?? '',
        type: input.type ?? 'text',
        ...(input.mediaId ? { mediaId: input.mediaId } : {}),
    };
}
/** Returns a short preview line for lists (first non-empty line, trimmed). */
export function thoughtPreview(thought, maxChars = 80) {
    const firstLine = thought.content.split('\n').find((l) => l.trim().length > 0);
    if (!firstLine)
        return thought.type === 'photo' ? 'Foto' : '...';
    const trimmed = firstLine.trim();
    return trimmed.length > maxChars
        ? `${trimmed.slice(0, maxChars - 1)}…`
        : trimmed;
}
/** Factory for a brand-new Thought with sensible defaults. */
export function createThought(draft) {
    const now = Date.now();
    return {
        id: generateId(),
        content: draft.content,
        type: draft.type,
        ...(draft.mediaId ? { mediaId: draft.mediaId } : {}),
        createdAt: now,
        updatedAt: now,
    };
}
//# sourceMappingURL=thought.js.map