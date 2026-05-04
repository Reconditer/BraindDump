import type { Thought } from '@braindump/core';
export declare function hydrateSearchIndex(thoughts: Thought[]): Promise<void>;
export declare function addToIndex(thought: Thought): void;
export declare function removeFromIndex(id: string): void;
export interface SearchResult {
    id: string;
    score: number;
}
export declare function searchThoughts(query: string): SearchResult[];
//# sourceMappingURL=search-index.d.ts.map