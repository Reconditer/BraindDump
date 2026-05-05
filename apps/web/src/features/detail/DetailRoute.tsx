import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import type { Thought } from '@braindump/core';
import { thoughtRepository } from '@braindump/db';
import { useAutoSave } from '@/hooks/useAutoSave';
import { SaveStatusIndicator } from '../capture/SaveStatusIndicator';
import { formatRelativeDate } from '../timeline/format-date';
import { SimilarThoughts } from '../similar/SimilarThoughts';
import { PhotoViewer } from '../photo/PhotoViewer';

/**
 * BLOCKER FIX: track `initializedId` keyed by thought.id
 * so navigating from /thought/a to /thought/b correctly resets content.
 */
export function DetailRoute() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const thought = useLiveQuery<Thought | null>(
    () => (id ? thoughtRepository.get(id).then((t) => t ?? null) : null),
    [id],
  );

  const [content, setContent] = useState('');
  const [initializedId, setInitializedId] = useState<string | null>(null);

  useEffect(() => {
    if (thought && initializedId !== thought.id) {
      setContent(thought.content);
      setInitializedId(thought.id);
    }
  }, [thought, initializedId]);

  const enabled = initializedId === thought?.id;

  const { status } = useAutoSave(
    content,
    async (val) => {
      if (!thought) return;
      if (!val.trim()) {
        await thoughtRepository.remove(thought.id);
        navigate('/timeline');
        return;
      }
      await thoughtRepository.save({ ...thought, content: val });
    },
    { delayMs: 800, enabled },
  );

  // still loading
  if (thought === undefined) return null;

  if (thought === null) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-sm text-ink-faint">Gedanke nicht gefunden.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex items-center justify-between px-5 pt-4 pb-2 desktop:px-8 desktop:pt-6">
        <Link
          to="/timeline"
          className="inline-flex min-h-[44px] items-center px-1 text-xs font-semibold uppercase tracking-widest text-ink-faint transition hover:text-ink-soft"
        >
          ← zurück
        </Link>
      </header>

      {/* Datum + Save-Status konsistent wie auf Capture-Screen */}
      <div className="flex items-center gap-2 px-5 pb-2 desktop:px-8">
        <div className="text-[10px] font-semibold uppercase tracking-widest text-accent-deep">
          {formatRelativeDate(thought.createdAt)}
        </div>
        <SaveStatusIndicator status={status} />
      </div>

      <main className="flex flex-1 flex-col px-5 tab-bar-offset desktop:px-8 desktop:pb-10">
        {/* Full-res photo if this is a photo thought */}
        {thought.type === 'photo' && thought.mediaId && (
          <div className="mb-4">
            <PhotoViewer mediaId={thought.mediaId} />
          </div>
        )}

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="schreib los."
          className="flex-1 resize-none bg-transparent text-lg leading-relaxed text-ink placeholder:text-ink-very-faint focus:outline-none desktop:text-xl"
          spellCheck
        />
        {/* Delete: NICHT sofort aus DB, erst zur Timeline navigieren.
            Timeline empfängt undoId und startet dort den 5s-Timer wie beim Swipe. */}
        <button
          type="button"
          onClick={() => {
            try { navigator.vibrate?.(10); } catch { /* ignore */ }
            navigate(`/timeline?undoId=${thought.id}`);
          }}
          className="mt-4 flex min-h-[44px] items-center self-start rounded-pill px-3 text-xs font-semibold uppercase tracking-widest text-ink-faint transition hover:text-pink"
          aria-label="Gedanken löschen"
        >
          löschen
        </button>

        <SimilarThoughts thought={thought} />
      </main>
    </div>
  );
}
