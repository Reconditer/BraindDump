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

import { pipeline, type FeatureExtractionPipeline } from '@xenova/transformers';

let extractor: FeatureExtractionPipeline | null = null;

async function loadModel() {
  extractor = await pipeline(
    'feature-extraction',
    'Xenova/all-MiniLM-L6-v2',
    { quantized: true },
  );
  self.postMessage({ type: 'ready' });
}

self.addEventListener('message', async (event: MessageEvent) => {
  const { type, id, text } = event.data as {
    type: string;
    id: string;
    text: string;
  };

  if (type === 'embed') {
    if (!extractor) {
      self.postMessage({ type: 'error', id, message: 'Model not loaded yet.' });
      return;
    }
    try {
      const output = await extractor(text, { pooling: 'mean', normalize: true });
      const embedding = Array.from(output.data as Float32Array);
      self.postMessage({ type: 'result', id, embedding });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      self.postMessage({ type: 'error', id, message });
    }
  }
});

void loadModel();
