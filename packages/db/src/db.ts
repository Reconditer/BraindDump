import Dexie, { type EntityTable } from 'dexie';
import type { Thought } from '@braindump/core';
import type { MediaRecord } from './media-repository.js';

/**
 * BrainDump local-first database.
 * Schema v1:
 *   thoughts: by id, indexed on createdAt for timeline ordering.
 *   media: by id, blobs kept separate to keep thoughts small.
 */
export class BrainDumpDB extends Dexie {
  thoughts!: EntityTable<Thought, 'id'>;
  media!: EntityTable<MediaRecord, 'id'>;

  constructor() {
    super('braindump');

    this.version(1).stores({
      thoughts: 'id, createdAt, updatedAt, type',
      media: 'id',
    });
  }
}

export const db = new BrainDumpDB();
