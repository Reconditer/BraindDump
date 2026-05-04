import { generateId } from './id.js';

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
export type ThoughtDraft = Pick<Thought, 'content' | 'type'> &
  Partial<Pick<Thought, 'mediaId'>>;

export function createThoughtDraft(
  input: Partial<ThoughtDraft> = {},
): ThoughtDraft {
  return {
    content: input.content ?? '',
    type: input.type ?? 'text',
    ...(input.mediaId ? { mediaId: input.mediaId } : {}),
  };
}

/** Returns a short preview line for lists (first non-empty line, trimmed). */
export function thoughtPreview(thought: Thought, maxChars = 80): string {
  const firstLine = thought.content.split('\n').find((l) => l.trim().length > 0);
  if (!firstLine) return thought.type === 'photo' ? 'Foto' : '...';
  const trimmed = firstLine.trim();
  return trimmed.length > maxChars
    ? `${trimmed.slice(0, maxChars - 1)}…`
    : trimmed;
}

/** Factory for a brand-new Thought with sensible defaults. */
export function createThought(draft: ThoughtDraft): Thought {
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
