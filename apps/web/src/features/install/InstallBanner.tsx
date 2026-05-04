import { useInstallPrompt } from './useInstallPrompt';

/**
 * Install banner shown once per session when the app is not yet installed.
 *
 * iOS: instructions to use Share → "Zum Home-Bildschirm"
 * Android/Desktop: native install prompt button
 */
export function InstallBanner() {
  const { platform, promptInstall, dismiss, visible } = useInstallPrompt();
  if (!visible) return null;

  return (
    <div className="bd-fade-in fixed bottom-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-content -translate-x-1/2 rounded-xl bg-white/90 px-4 py-3.5 shadow-lg backdrop-blur-md">
      <div className="flex items-start gap-3">
        <img src="/icon-192.png" alt="" width={36} height={36} className="rounded-md shrink-0" />
        <div className="flex-1 min-w-0">
          {platform === 'ios' ? (
            <>
              <p className="text-sm font-medium text-ink">BrainDump installieren</p>
              <p className="mt-0.5 text-xs text-ink-faint">
                Tippe auf <ShareIcon /> dann „Zum Home-Bildschirm".
              </p>
            </>
          ) : (
            <>
              <p className="text-sm font-medium text-ink">BrainDump installieren</p>
              <p className="mt-0.5 text-xs text-ink-faint">
                Für schnelleren Zugriff auf dem Home-Bildschirm.
              </p>
            </>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {promptInstall && (
            <button
              type="button"
              onClick={() => void promptInstall()}
              className="rounded-pill bg-accent-deep px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-accent"
            >
              installieren
            </button>
          )}
          <button
            type="button"
            onClick={dismiss}
            aria-label="schließen"
            className="text-ink-faint transition hover:text-ink"
          >
            <XIcon />
          </button>
        </div>
      </div>
    </div>
  );
}

function ShareIcon() {
  return (
    <svg
      className="inline-block align-text-bottom"
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}
