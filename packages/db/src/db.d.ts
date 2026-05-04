import Dexie, { type EntityTable } from 'dexie';
import type { Thought } from '@braindump/core';
import type { MediaRecord } from './media-repository.js';
/**
 * BrainDump local-first database.
 * Schema v1:
 *   thoughts: by id, indexed on createdAt for timeline ordering.
 *   media: by id, blobs kept separate to keep thoughts small.
 */
export declare class BrainDumpDB extends Dexie {
    thoughts: EntityTable<Thought, 'id'>;
    media: EntityTable<MediaRecord, 'id'>;
    constructor();
}
export declare const db: BrainDumpDB;
//# sourceMappingURL=db.d.ts.map