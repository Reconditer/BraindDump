import { useNavigate } from 'react-router-dom';

const ONBOARDING_KEY = 'bd-onboarding-done';

export function hasSeenOnboarding(): boolean {
  try { return localStorage.getItem(ONBOARDING_KEY) === '1'; }
  catch { return false; }
}

export function markOnboardingDone(): void {
  try { localStorage.setItem(ONBOARDING_KEY, '1'); } catch { /* ignore */ }
}

export function OnboardingRoute() {
  const navigate = useNavigate();

  const handleStart = () => {
    markOnboardingDone();
    navigate('/', { replace: true });
  };

  return (
    <div className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden px-3 py-8 desktop:px-6">
      {/* Aurora background */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 bg-grad-bg" />
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 bg-white/20" />

      {/* px-4 Außen-Padding → Card nutzt volle Breite minus 32px Rand, kein Clip */}
      <div
        className="w-full max-w-sm rounded-2xl p-6 desktop:max-w-md desktop:p-10"
        style={{ background: 'rgba(255,255,255,0.55)', backdropFilter: 'blur(24px)' }}
      >
        <div className="bd-meta mb-5 text-accent-deep">Willkommen</div>

        <h1
          className="bd-display mb-6 text-ink"
          style={{ fontSize: 'clamp(32px, 5vw, 44px)', lineHeight: 1.1 }}
        >
          Schreib einfach{' '}
          <span className="bd-display-italic text-accent-deep">los.</span>
        </h1>

        <p className="bd-body mb-3 break-words text-ink-soft" style={{ lineHeight: 1.7 }}>
          Keine Tags. Keine Ordner. Keine Einrichtung.
        </p>
        <p className="bd-body mb-8 break-words text-ink-soft" style={{ lineHeight: 1.7 }}>
          Wir kümmern uns um Struktur —<br />du um Gedanken.
        </p>

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

        <p className="bd-body-sm mt-4 text-center text-ink-faint">
          Du kannst alles später ändern.
        </p>
      </div>
    </div>
  );
}
