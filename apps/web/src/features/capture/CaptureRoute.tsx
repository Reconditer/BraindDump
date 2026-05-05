import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Thought } from '@braindump/core';
import { createThought } from '@braindump/core';
import { thoughtRepository } from '@braindump/db';
import { useAutoSave } from '@/hooks/useAutoSave';
import { requestPersistentStorage } from '@/utils/storage';
import { SaveStatusIndicator } from './SaveStatusIndicator';
import { PhotoCapture } from '../photo/PhotoCapture';

type CaptureMode = 'text' | 'photo' | 'voice';

/**
 * UC1 · Sofort-Capture — nach Prototyp-Vorlage (S2_UC1 aus hifi-soft-v2.jsx):
 *
 * - Header: Search-Icon (links) + Grid-Icon (rechts) als IconBubbles
 * - Datum + Uhrzeit klein unter dem Header
 * - Blinkender Cursor-Balken links der Headline
 * - Headline: "Was geht dir gerade durch den Kopf?" (Fraunces, muted)
 * - Textarea unsichtbar über den Bereich
 * - ModeSelector: Schreiben (aktiv) / Foto / Sprechen
 */
export function CaptureRoute() {
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [activeMode, setActiveMode] = useState<CaptureMode>('text');
  const [thought, setThought] = useState<Thought | null>(null);
  const [now, setNow] = useState(() => new Date());
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Live-Uhrzeit jede Minute updaten
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    void requestPersistentStorage();
  }, []);

  // Desktop: auto-focus
  useEffect(() => {
    if (window.matchMedia('(min-width: 768px)').matches) {
      textareaRef.current?.focus();
    }
  }, []);

  const { status, flush, cancel } = useAutoSave(
    content,
    async (val) => {
      const trimmed = val.trim();
      if (!trimmed) {
        if (thought) { await thoughtRepository.remove(thought.id); setThought(null); }
        return;
      }
      if (!thought) {
        const created = await thoughtRepository.save(createThought({ content: val, type: 'text' }));
        setThought(created);
      } else {
        const saved = await thoughtRepository.save({ ...thought, content: val });
        setThought(saved);
      }
    },
    { delayMs: 800 },
  );

  const handleNewCapture = () => {
    flush();
    setContent('');
    setThought(null);
    setActiveMode('text');
    setTimeout(() => textareaRef.current?.focus(), 50);
  };

  const dateStr = now.toLocaleDateString('de-DE', { weekday: 'long' });
  const timeStr = now.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="flex flex-1 flex-col">
      {/* ── Header: Search + Grid IconBubbles ── */}
      <header className="flex items-center justify-between px-5 pt-4 desktop:px-8 desktop:pt-6">
        <button
          type="button"
          aria-label="Suchen"
          onClick={() => navigate('/timeline?search=1')}
          className="flex h-9 w-9 items-center justify-center rounded-full shadow-sm backdrop-blur-md transition hover:bg-white"
          style={{ background: 'rgba(255,255,255,0.65)' }}
        >
          <SearchIcon />
        </button>

        <SaveStatusIndicator status={status} />

        <button
          type="button"
          aria-label="Alle Gedanken"
          onClick={() => navigate('/timeline')}
          className="flex h-9 w-9 items-center justify-center rounded-full shadow-sm backdrop-blur-md transition hover:bg-white"
          style={{ background: 'rgba(255,255,255,0.65)' }}
        >
          <GridIcon />
        </button>
      </header>

      {/* ── Datum + Uhrzeit ── */}
      <div className="bd-meta px-5 pt-3 pb-1 text-accent-deep desktop:px-8">
        {dateStr} · {timeStr}
      </div>

      {/* ── Editor-Bereich: Cursor + Headline + Textarea ── */}
      <main
        className="relative flex flex-1 flex-col px-5 desktop:px-8"
        onClick={() => textareaRef.current?.focus()}
      >
        {/* Headline mit blinkendem Cursor — versteckt wenn getippt */}
        {!content && (
          <div className="pointer-events-none flex items-start gap-3 pt-12 desktop:pt-14">
            <span className="bd-cursor-blink" style={{ height: 36, marginTop: 4 }} />
            <h1
              className="bd-display m-0 text-ink-soft"
              style={{ fontSize: 28, lineHeight: 1.25 }}
            >
              Was geht dir<br />
              gerade durch<br />
              den Kopf?
            </h1>
          </div>
        )}

        {/* Unsichtbare Textarea über den gesamten Bereich */}
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder=""
          className="absolute inset-0 h-full w-full resize-none bg-transparent px-5 pt-14 text-lg leading-relaxed text-ink focus:outline-none desktop:px-8 desktop:pt-16 desktop:text-xl"
          style={{ caretColor: 'var(--bd-accent-deep)' }}
          autoCorrect="on"
          autoCapitalize="sentences"
          spellCheck
          onKeyDown={(e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
              e.preventDefault();
              navigate('/timeline');
            }
          }}
        />
      </main>

      {/* ── ModeSelector: Schreiben / Foto / Sprechen ── */}
      <div className="px-4 pb-5 pt-2 desktop:px-8">
        <div
          className="flex items-center justify-around rounded-[20px] px-4 py-3.5 shadow-md"
          style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(20px)' }}
        >
          <ModeButton
            icon="text"
            label="Schreiben"
            active={activeMode === 'text'}
            onClick={() => { setActiveMode('text'); textareaRef.current?.focus(); }}
          />

          {/* Foto-Mode: PhotoCapture integriert */}
          {activeMode === 'photo' ? (
            <div className="flex flex-col items-center gap-1.5">
              <PhotoCapture
                onSaved={(id) => {
                  // cancel statt flush — kein leerer Auto-Save der den Thought löscht
                  cancel();
                  navigate(`/thought/${id}`);
                }}
              />
              <span className="bd-body-sm text-[11px] font-semibold text-accent-deep">Foto</span>
            </div>
          ) : (
            <ModeButton
              icon="photo"
              label="Foto"
              active={false}
              onClick={() => setActiveMode('photo')}
            />
          )}

          <ModeButton
            icon="voice"
            label="Sprechen"
            active={activeMode === 'voice'}
            onClick={() => setActiveMode('voice')}
            disabled
          />
        </div>

        {/* Voice nicht unterstützt Hinweis */}
        {activeMode === 'voice' && (
          <p className="bd-body-sm mt-2 text-center text-ink-faint" style={{ fontSize: 11 }}>
            Voice ist in dieser Version nicht verfügbar.
          </p>
        )}

        {/* + Neuer Gedanke wenn schon was getippt */}
        {thought && (
          <button
            type="button"
            onClick={handleNewCapture}
            className="bd-label mt-3 block w-full text-center text-ink-faint transition hover:text-accent-deep"
          >
            + neuer gedanke
          </button>
        )}
      </div>
    </div>
  );
}

/* ── Sub-Components ── */

function ModeButton({
  icon, label, active, onClick, disabled = false,
}: {
  icon: 'text' | 'photo' | 'voice';
  label: string;
  active: boolean;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex flex-col items-center gap-1.5 disabled:opacity-40"
    >
      <div
        className="flex h-[46px] w-[46px] items-center justify-center rounded-full transition"
        style={{
          background: active
            ? 'linear-gradient(135deg, var(--bd-accent), var(--bd-accent-deep))'
            : 'rgba(124,77,216,0.08)',
          boxShadow: active ? '0 4px 14px rgba(182,124,245,0.55)' : 'none',
          color: active ? '#fff' : 'var(--bd-accent-deep)',
        }}
      >
        {icon === 'text' && <TextIcon />}
        {icon === 'photo' && <PhotoIcon />}
        {icon === 'voice' && <VoiceIcon />}
      </div>
      <span
        className="text-[11px] font-semibold"
        style={{ color: active ? 'var(--bd-accent-deep)' : 'var(--bd-ink-soft)' }}
      >
        {label}
      </span>
    </button>
  );
}

/* ── Icons ── */
function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="10.5" cy="10.5" r="6" /><path d="M19 19l-4-4" />
    </svg>
  );
}
function GridIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}
function TextIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <path d="M5 6h14M5 10h10M5 14h14M5 18h8" />
    </svg>
  );
}
function PhotoIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 8h3l2-3h8l2 3h3v11H3z" /><circle cx="12" cy="13" r="4" />
    </svg>
  );
}
function VoiceIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="9" y="3" width="6" height="12" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
    </svg>
  );
}
