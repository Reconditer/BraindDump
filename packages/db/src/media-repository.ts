import { generateId } from '@braindump/core';
import { db } from './db.js';

export interface MediaRecord {
  id: string;
  /** Main blob, already client-side compressed (JPEG/WebP). */
  data: Blob;
  /** Small thumbnail (~200px) for list rendering. */
  thumb: Blob;
  mimeType: string;
  width: number;
  height: number;
  createdAt: number;
}

export class MediaRepository {
  async create(input: Omit<MediaRecord, 'id' | 'createdAt'>): Promise<MediaRecord> {
    const record: MediaRecord = {
      ...input,
      id: generateId(),
      createdAt: Date.now(),
    };
    await db.media.add(record);
    return record;
  }

  async get(id: string): Promise<MediaRecord | undefined> {
    return db.media.get(id);
  }

  async remove(id: string): Promise<void> {
    await db.media.delete(id);
  }
}

export const mediaRepository = new MediaRepository();
