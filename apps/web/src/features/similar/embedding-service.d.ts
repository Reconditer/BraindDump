/**
 * Bridge between React components and the embedding Web Worker.
 *
 * Fixes applied:
 * - Correct worker path (../../workers relative to this file)
 * - Worker error event resolves all pending promises with null
 *   so SimilarThoughts never hangs indefinitely
 */
declare class EmbeddingService {
    private worker;
    private status;
    private pending;
    private readyCallbacks;
    constructor();
    private init;
    private handleWorkerError;
    private handleMessage;
    isReady(): boolean;
    onReady(cb: () => void): void;
    embed(text: string): Promise<number[] | null>;
}
export declare const embeddingService: EmbeddingService;
/** Cosine similarity between two equal-length vectors */
export declare function cosineSimilarity(a: number[], b: number[]): number;
export {};
//# sourceMappingURL=embedding-service.d.ts.map