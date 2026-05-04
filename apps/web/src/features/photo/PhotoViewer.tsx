import { useEffect, useState } from 'react';
import { mediaRepository } from '@braindump/db';

interface Props {
  mediaId: string;
}

/**
 * Full-resolution photo viewer.
 * Loads the main blob (not thumb) from Dexie and renders it full-width.
 * Revokes object URL on unmount.
 */
export function PhotoViewer({ mediaId }: Props) {
  const [src, setSrc] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let objectUrl: string | null = null;
    let cancelled = false;

    void mediaRepository.get(mediaId).then((record) => {
      if (cancelled || !record) { setError(true); return; }
      objectUrl = URL.createObjectURL(record.data);
      setSrc(objectUrl);
    });

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [mediaId]);

  if (error) {
    return (
      <div className="flex h-48 items-center justify-center rounded-lg bg-accent-soft">
        <span className="text-xs text-ink-faint">Foto nicht gefunden</span>
      </div>
    );
  }

  if (!src) {
    return (
      <div className="h-48 animate-pulse rounded-lg bg-accent-soft/60" />
    );
  }

  return (
    <img
      src={src}
      alt=""
      className="w-full rounded-lg object-contain shadow-md"
      style={{ maxHeight: '60vh' }}
    />
  );
}
