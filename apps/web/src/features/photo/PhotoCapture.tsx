import { useRef, useState } from 'react';
import { compressImage } from '@/utils/compress-image';
import { db } from '@braindump/db';
import { createThought } from '@braindump/core';

type Status = 'idle' | 'compressing' | 'saving' | 'done' | 'error';

interface Props {
  onSaved: (thoughtId: string) => void;
}

/**
 * Foto-Capture button + hidden file input.
 *
 * Fixes applied:
 * - WICHTIG: media + thought creation wrapped in a single Dexie transaction
 *   so a partial failure cannot leave orphaned blobs.
 * - WICHTIG: preview object URL always revoked (in finally).
 */
export function PhotoCapture({ onSaved }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [status, setStatus] = useState<Status>('idle');

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) return;
    setStatus('compressing');

    let previewUrl: string | null = null;
    try {
      previewUrl = URL.createObjectURL(file);
      const compressed = await compressImage(file);
      setStatus('saving');

      // WICHTIG FIX: atomic transaction — both records created or neither
      let savedThoughtId = '';
      await db.transaction('rw', db.thoughts, db.media, async () => {
        const now = Date.now();
        const mediaId = crypto.randomUUID();
        await db.media.add({
          id: mediaId,
          data: compressed.main,
          thumb: compressed.thumb,
          mimeType: compressed.mimeType,
          width: compressed.width,
          height: compressed.height,
          createdAt: now,
        });
        const thought = createThought({ type: 'photo', content: '', mediaId });
        await db.thoughts.add(thought);
        savedThoughtId = thought.id;
      });

      setStatus('done');
      onSaved(savedThoughtId);
    } catch (err) {
      console.error('[PhotoCapture]', err);
      setStatus('error');
    } finally {
      // WICHTIG FIX: always revoke object URL
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    }
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleFile(file);
          e.target.value = '';
        }}
      />
      <button
        type="button"
        aria-label="Foto aufnehmen oder importieren"
        disabled={status === 'compressing' || status === 'saving'}
        onClick={() => inputRef.current?.click()}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-white/70 shadow-sm backdrop-blur-sm transition hover:bg-white disabled:opacity-50"
      >
        {status === 'compressing' || status === 'saving' ? <Spinner /> : <CameraIcon />}
      </button>
      {status === 'error' && (
        <p className="mt-1 text-xs text-pink">Foto konnte nicht gespeichert werden.</p>
      )}
    </>
  );
}

function CameraIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

function Spinner() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  );
}
