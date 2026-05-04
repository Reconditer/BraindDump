/**
 * Web Worker: Embedding via transformers.js (on-device, no API key).
 * Model: Xenova/all-MiniLM-L6-v2 — 22 MB, 384 dimensions.
 * Runs entirely in the browser, zero privacy leakage.
 *
 * Messages IN:
 *   { type: 'embed', id: string, text: string }
 *
 * Messages OUT:
 *   { type: 'ready' }                        — model loaded
 *   { type: 'result', id: string, embedding: number[] }
 *   { type: 'error',  id: string, message: string }
 */
export {};
//# sourceMappingURL=embedding.worker.d.ts.map