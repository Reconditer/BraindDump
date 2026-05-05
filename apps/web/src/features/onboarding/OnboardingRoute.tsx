import { useNavigate } from 'react-router-dom';

const ONBOARDING_KEY = 'bd-onboarding-done';

export function hasSeenOnboarding(): boolean {
  try { return localStorage.getItem(ONBOARDING_KEY) === '1'; }
  catch { return false; }
}

export function markOnboardingDone(): void {
  try { localStorage.setItem(ONBOARDING_KEY, '1'); } catch { /* ignore */ }
}

/**
 * UC5 · Stilles Onboarding — eigenes minimales Layout ohne Tab-Bar/Sidebar.
 */
export function OnboardingRoute() {
  const navigate = useNavigate();

  const handleStart = () => {
    markOnboardingDone();
    navigate('/', { replace: true });
  };

  return (
    // Eigener Fullscreen-Wrapper mit Aurora-Gradient — keine AppLayout-Nav
    <div className="relative flex min-h-[100dvh] flex-col overflow-hidden">
      {/* Aurora background */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 bg-grad-bg" />
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 bg-white/30" />

      {/* Content — zentriert auf Desktop, Full-Screen auf Mobile */}
      <div className="mx-auto flex w-full max-w-content flex-1 flex-col px-8 pb-10 pt-12 desktop:px-12 desktop:pt-[20vh]"
        style={{ paddingBottom: 'max(2.5rem, env(safe-area-inset-bottom))' }}
      >
        {/* Top label */}
        <div className="mb-14 desktop:mb-10">
          <span className="bd-label text-ink-faint">1 / 1</span>
        </div>

        {/* Main content */}
        <div className="flex-1">
          <div className="bd-meta mb-6 text-accent-deep">Willkommen</div>

          <h1 className="bd-display mb-7 text-ink" style={{ fontSize: 'clamp(28px, 5vw, 48px)', lineHeight: 1.15 }}>
            Schreib einfach{' '}
            <span className="bd-display-italic text-accent-deep">los.</span>
          </h1>

          <p className="bd-body mb-4 max-w-[320px] text-ink-soft" style={{ lineHeight: 1.65 }}>
            Keine Tags. Keine Ordner.<br />Keine Einrichtung.
          </p>
          <p className="bd-body max-w-[320px] text-ink-soft" style={{ lineHeight: 1.65 }}>
            Wir kümmern uns um Struktur —<br />du um Gedanken.
          </p>
        </div>

        {/* CTA */}
        <div className="pb-2">
          <button
            type="button"
            onClick={handleStart}
            className="w-full rounded-xl py-4 text-[15px] font-semibold text-white shadow-lg transition hover:opacity-90 active:scale-[0.98]"
            style={{
              background: 'linear-gradient(135deg, var(--bd-accent), var(--bd-accent-deep))',
              boxShadow: '0 4px 18px rgba(182,124,245,0.45)',
            }}
          >
            Ersten Gedanken festhalten →
          </button>
          <p className="bd-body-sm mt-4 text-center text-ink-faint" style={{ fontSize: 11 }}>
            Du kannst alles später ändern.
          </p>
        </div>
      </div>
    </div>
  );
}
