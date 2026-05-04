import MiniSearch from 'minisearch';
import type { Thought } from '@braindump/core';

/**
 * Singleton MiniSearch index.
 * Built lazily from Dexie on first search, kept in memory.
 * Updated incrementally on every save/delete.
 */

const index = new MiniSearch<Thought>({
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

export async function hydrateSearchIndex(thoughts: Thought[]): Promise<void> {
  if (hydrated) return;
  index.addAll(thoughts);
  hydrated = true;
}

export function addToIndex(thought: Thought): void {
  // MiniSearch throws if id already exists → discard first
  try { index.discard(thought.id); } catch { /* not in index yet */ }
  index.add(thought);
}

export function removeFromIndex(id: string): void {
  try { index.discard(id); } catch { /* already gone */ }
}

export interface SearchResult {
  id: string;
  score: number;
}

export function searchThoughts(query: string): SearchResult[] {
  if (!query.trim()) return [];
  return index.search(query).map((r) => ({ id: r.id as string, score: r.score }));
}
