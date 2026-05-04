/**
 * Bridge between React components and the embedding Web Worker.
 *
 * Fixes applied:
 * - Correct worker path (../../workers relative to this file)
 * - Worker error event resolves all pending promises with null
 *   so SimilarThoughts never hangs indefinitely
 */

type WorkerStatus = 'loading' | 'ready' | 'error';

interface PendingRequest {
  resolve: (embedding: number[] | null) => void;
}

class EmbeddingService {
  private worker: Worker | null = null;
  private status: WorkerStatus = 'loading';
  private pending = new Map<string, PendingRequest>();
  private readyCallbacks: Array<() => void> = [];

  constructor() {
    this.init();
  }

  private init() {
    try {
      this.worker = new Worker(
        // BLOCKER FIX: correct path relative to this file (features/similar → src/workers)
        new URL('../../workers/embedding.worker.ts', import.meta.url),
        { type: 'module' },
      );
      this.worker.addEventListener('message', this.handleMessage.bind(this));
      this.worker.addEventListener('error', this.handleWorkerError.bind(this));
    } catch {
      this.status = 'error';
    }
  }

  private handleWorkerError() {
    // WICHTIG FIX: drain all waiting callbacks + pending embeds so nothing hangs
    this.status = 'error';
    this.readyCallbacks.splice(0).forEach((cb) => cb());
    this.pending.forEach((p) => p.resolve(null));
    this.pending.clear();
  }

  private handleMessage(event: MessageEvent) {
    const { type, id, embedding, message } = event.data as {
      type: string;
      id: string;
      embedding?: number[];
      message?: string;
    };

    if (type === 'ready') {
      this.status = 'ready';
      this.readyCallbacks.splice(0).forEach((cb) => cb());
      return;
    }

    const pending = this.pending.get(id);
    if (!pending) return;
    this.pending.delete(id);

    if (type === 'result' && embedding) {
      pending.resolve(embedding);
    } else {
      console.warn('[EmbeddingService] worker error for', id, message);
      pending.resolve(null);
    }
  }

  isReady(): boolean {
    return this.status === 'ready';
  }

  onReady(cb: () => void) {
    if (this.status === 'ready') {
      cb();
    } else if (this.status === 'error') {
      // Don't hang — call immediately so awaiting code can bail
      cb();
    } else {
      this.readyCallbacks.push(cb);
    }
  }

  async embed(text: string): Promise<number[] | null> {
    if (this.status === 'error' || !this.worker) return null;

    if (this.status !== 'ready') {
      await new Promise<void>((resolve) => this.onReady(resolve));
    }

    // Re-check after await — might have errored while waiting
    if ((this.status as WorkerStatus) === 'error') return null;

    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    return new Promise((resolve) => {
      this.pending.set(id, { resolve });
      this.worker!.postMessage({ type: 'embed', id, text });
    });
  }
}

export const embeddingService = new EmbeddingService();

/** Cosine similarity between two equal-length vectors */
export function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    const ai = a[i] ?? 0;
    const bi = b[i] ?? 0;
    dot += ai * bi;
    normA += ai * ai;
    normB += bi * bi;
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  return denom === 0 ? 0 : dot / denom;
}
