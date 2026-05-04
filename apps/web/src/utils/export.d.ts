/** Export all thoughts as a JSON file */
export declare function exportAsJSON(): Promise<void>;
/**
 * Export everything as a ZIP:
 * - thoughts.json (all text + metadata)
 * - photos/ directory with original compressed JPEGs
 */
export declare function exportAsZIP(onProgress?: (current: number, total: number) => void): Promise<void>;
//# sourceMappingURL=export.d.ts.map