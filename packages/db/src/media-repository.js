import { generateId } from '@braindump/core';
import { db } from './db.js';
export class MediaRepository {
    async create(input) {
        const record = {
            ...input,
            id: generateId(),
            createdAt: Date.now(),
        };
        await db.media.add(record);
        return record;
    }
    async get(id) {
        return db.media.get(id);
    }
    async remove(id) {
        await db.media.delete(id);
    }
}
export const mediaRepository = new MediaRepository();
//# sourceMappingURL=media-repository.js.map