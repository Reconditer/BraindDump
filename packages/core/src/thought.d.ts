export type ThoughtType = 'text' | 'photo';
/**
 * A single Thought. Lives in Dexie locally.
 * Voice is out of POC scope.
 */
export interface Thought {
    id: string;
    content: string;
    type: ThoughtType;
    /** References a blob in the media table (separate to keep Thoughts small). */
    mediaId?: string;
    /** Float32 array (length 384 for MiniLM). Undefined until embedding ran. */
    embedding?: number[];
    createdAt: number;
    updatedAt: number;
}
/** A Thought that has not yet been saved. */
export type ThoughtDraft = Pick<Thought, 'content' | 'type'> & Partial<Pick<Thought, 'mediaId'>>;
export declare function createThoughtDraft(input?: Partial<ThoughtDraft>): ThoughtDraft;
/** Returns a short preview line for lists (first non-empty line, trimmed). */
export declare function thoughtPreview(thought: Thought, maxChars?: number): string;
/** Factory for a brand-new Thought with sensible defaults. */
export declare function createThought(draft: ThoughtDraft): Thought;
//# sourceMappingURL=thought.d.ts.map