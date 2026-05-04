import { useEffect, useState } from 'react';
import { mediaRepository } from '@braindump/db';

interface Props {
  mediaId: string;
  size?: number;
  className?: string;
}

/**
 * Lazy-loads a thumbnail from Dexie (Blob → object URL).
 * Revokes the object URL on unmount to avoid memory leaks.
 */
export function PhotoThumb({ mediaId, size = 48, className = '' }: Props) {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    let objectUrl: string | null = null;
    let cancelled = false;

    void mediaRepository.get(mediaId).then((record) => {
      if (cancelled || !record) return;
      objectUrl = URL.createObjectURL(record.thumb);
      setSrc(objectUrl);
    });

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [mediaId]);

  if (!src) {
    return (
      <div
        style={{ width: size, height: size }}
        className={`rounded-md bg-accent-soft ${className}`}
      />
    );
  }

  return (
    <img
      src={src}
      alt=""
      width={size}
      height={size}
      className={`rounded-md object-cover ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
