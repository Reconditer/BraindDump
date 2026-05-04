/**
 * Wrappers around navigator.storage:
 * - persist(): request permanent storage (no 7-day iOS eviction)
 * - estimate(): how much quota is used / available
 */
export interface StorageEstimate {
    usedMB: number;
    quotaMB: number;
    usedPercent: number;
}
export declare function requestPersistentStorage(): Promise<boolean>;
export declare function getStorageEstimate(): Promise<StorageEstimate | null>;
/** Format bytes as human-readable string */
export declare function formatMB(mb: number): string;
//# sourceMappingURL=storage.d.ts.map