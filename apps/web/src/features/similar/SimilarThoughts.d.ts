import type { Thought } from '@braindump/core';
interface Props {
    thought: Thought;
}
/**
 * Magic #2: Ähnliche Gedanken.
 * Shown in the detail view below the thought text.
 *
 * On mount:
 * 1. Embed the current thought (or use cached embedding).
 * 2. Load all other thoughts with embeddings from Dexie.
 * 3. Compute cosine similarity, return top K > MIN_SIMILARITY.
 */
export declare function SimilarThoughts({ thought }: Props): import("react/jsx-runtime").JSX.Element | null;
export {};
//# sourceMappingURL=SimilarThoughts.d.ts.map