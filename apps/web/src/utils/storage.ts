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

export async function requestPersistentStorage(): Promise<boolean> {
  if (!navigator.storage?.persist) return false;
  try {
    return await navigator.storage.persist();
  } catch {
    return false;
  }
}

export async function getStorageEstimate(): Promise<StorageEstimate | null> {
  if (!navigator.storage?.estimate) return null;
  try {
    const { usage = 0, quota = 0 } = await navigator.storage.estimate();
    const usedMB = usage / (1024 * 1024);
    const quotaMB = quota / (1024 * 1024);
    const usedPercent = quotaMB > 0 ? (usedMB / quotaMB) * 100 : 0;
    return { usedMB, quotaMB, usedPercent };
  } catch {
    return null;
  }
}

/** Format bytes as human-readable string */
export function formatMB(mb: number): string {
  if (mb < 1) return `${Math.round(mb * 1024)} KB`;
  if (mb < 1024) return `${mb.toFixed(1)} MB`;
  return `${(mb / 1024).toFixed(2)} GB`;
}
