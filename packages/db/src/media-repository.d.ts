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
export declare class MediaRepository {
    create(input: Omit<MediaRecord, 'id' | 'createdAt'>): Promise<MediaRecord>;
    get(id: string): Promise<MediaRecord | undefined>;
    remove(id: string): Promise<void>;
}
export declare const mediaRepository: MediaRepository;
//# sourceMappingURL=media-repository.d.ts.map