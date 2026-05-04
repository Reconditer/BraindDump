import Dexie from 'dexie';
/**
 * BrainDump local-first database.
 * Schema v1:
 *   thoughts: by id, indexed on createdAt for timeline ordering.
 *   media: by id, blobs kept separate to keep thoughts small.
 */
export class BrainDumpDB extends Dexie {
    thoughts;
    media;
    constructor() {
        super('braindump');
        this.version(1).stores({
            thoughts: 'id, createdAt, updatedAt, type',
            media: 'id',
        });
    }
}
export const db = new BrainDumpDB();
//# sourceMappingURL=db.js.map