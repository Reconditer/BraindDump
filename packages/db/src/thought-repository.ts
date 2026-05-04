import type { Thought, ThoughtDraft } from '@braindump/core';
import { createThought } from '@braindump/core';
import { liveQuery, type Observable } from 'dexie';
import { db } from './db.js';

export class ThoughtRepository {
  async create(draft: ThoughtDraft): Promise<Thought> {
    const thought = createThought(draft);
    await db.thoughts.add(thought);
    return thought;
  }

  async save(thought: Thought): Promise<Thought> {
    const next: Thought = { ...thought, updatedAt: Date.now() };
    await db.thoughts.put(next);
    return next;
  }

  async get(id: string): Promise<Thought | undefined> {
    return db.thoughts.get(id);
  }

  /**
   * WICHTIG FIX: cascade-deletes the associated media blob in a single
   * Dexie transaction so no orphaned blobs can accumulate.
   */
  async remove(id: string): Promise<void> {
    await db.transaction('rw', db.thoughts, db.media, async () => {
      const thought = await db.thoughts.get(id);
      await db.thoughts.delete(id);
      if (thought?.mediaId) {
        await db.media.delete(thought.mediaId);
      }
    });
  }

  async listNewestFirst(limit = 500): Promise<Thought[]> {
    return db.thoughts.orderBy('createdAt').reverse().limit(limit).toArray();
  }

  async count(): Promise<number> {
    return db.thoughts.count();
  }

  observeNewestFirst(limit = 500): Observable<Thought[]> {
    return liveQuery(() =>
      db.thoughts.orderBy('createdAt').reverse().limit(limit).toArray(),
    );
  }
}

export const thoughtRepository = new ThoughtRepository();
