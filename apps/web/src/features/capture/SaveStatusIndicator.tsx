import type { SaveStatus } from '@/hooks/useAutoSave';

const LABELS: Record<SaveStatus, string> = {
  idle: '',
  dirty: '·',
  saving: '· speichert',
  saved: '· gespeichert',
  error: '· fehler',
};

/**
 * Tiny inline indicator. Shows only when there's something to show.
 * Never blocks interaction, never takes more space than a few characters.
 */
export function SaveStatusIndicator({ status }: { status: SaveStatus }) {
  const label = LABELS[status];
  if (!label) return null;

  const color =
    status === 'error'
      ? 'text-pink'
      : status === 'saved'
        ? 'text-ink-faint'
        : 'text-ink-very-faint';

  return (
    <span
      className={`text-xs font-medium ${color} ${
        status === 'saved' ? 'bd-saved-indicator' : ''
      }`}
      aria-live="polite"
    >
      {label}
    </span>
  );
}
