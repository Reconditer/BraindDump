import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { thoughtRepository } from '@braindump/db';
import { getStorageEstimate, formatMB } from '@/utils/storage';
import { exportAsJSON, exportAsZIP } from '@/utils/export';

export function SettingsRoute() {
  const [count, setCount] = useState<number | null>(null);
  const [storage, setStorage] = useState<{ usedMB: number; quotaMB: number; usedPercent: number } | null>(null);
  const [exportStatus, setExportStatus] = useState<'idle' | 'running' | 'done' | 'error'>('idle');
  const [zipProgress, setZipProgress] = useState<{ current: number; total: number } | null>(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    // WICHTIG FIX: cancellation flag prevents setState after unmount
    void Promise.all([
      thoughtRepository.count(),
      getStorageEstimate(),
    ]).then(([c, s]) => {
      if (!mounted.current) return;
      setCount(c);
      setStorage(s);
    });
    return () => { mounted.current = false; };
  }, []);

  const handleExportJSON = async () => {
    setExportStatus('running');
    try {
      await exportAsJSON();
      setExportStatus('done');
    } catch {
      setExportStatus('error');
    }
  };

  const handleExportZIP = async () => {
    setExportStatus('running');
    setZipProgress(null);
    try {
      await exportAsZIP((cur, total) => {
        if (mounted.current) setZipProgress({ current: cur, total });
      });
      setExportStatus('done');
    } catch {
      setExportStatus('error');
    } finally {
      // NICE FIX: always clear progress
      if (mounted.current) setZipProgress(null);
    }
  };

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex items-center px-5 pt-4 pb-4 desktop:px-8 desktop:pt-6">
        <Link
          to="/timeline"
          className="inline-flex min-h-[44px] items-center px-1 text-xs font-semibold uppercase tracking-widest text-ink-faint transition hover:text-ink-soft"
        >
          ← zurück
        </Link>
      </header>

      <main className="flex flex-1 flex-col gap-6 overflow-auto px-5 pb-24 desktop:px-8">
        <h1 className="max-w-xl text-xl font-semibold text-ink">Einstellungen</h1>

        <Section title="Speicher">
          <div className="overflow-hidden rounded-lg bg-white/75 p-4 shadow-sm">
            <p className="mb-3 text-xs text-ink-faint">
              Deine Gedanken liegen <strong>lokal auf diesem Gerät</strong>. Kein Cloud-Sync.
            </p>
            {count !== null && <InfoRow label="Gespeicherte Gedanken" value={`${count}`} />}
            {storage && (
              <>
                <InfoRow label="Verwendet" value={formatMB(storage.usedMB)} />
                <InfoRow label="Verfügbar" value={formatMB(storage.quotaMB)} />
                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-pill bg-accent-soft">
                  <div
                    className="h-full rounded-pill bg-accent-deep transition-all"
                    style={{ width: `${Math.min(100, storage.usedPercent).toFixed(1)}%` }}
                  />
                </div>
                {storage.usedPercent > 90 && (
                  // UX-Standard: klarer Error-Toast mit Handlungsaufforderung
                  <div className="mt-2 rounded-md bg-pink-soft px-3 py-2">
                    <p className="text-xs font-semibold text-pink">
                      Speicher fast voll.
                    </p>
                    <p className="text-xs text-ink-soft">
                      Exportiere deine Daten und lösche ältere Einträge.
                    </p>
                  </div>
                )}
                {storage.usedPercent > 80 && storage.usedPercent <= 90 && (
                  <p className="mt-2 text-xs text-ink-soft">
                    Speicher zu 80 % gefüllt — Export empfohlen.
                  </p>
                )}
              </>
            )}
          </div>
        </Section>

        <Section title="Daten exportieren">
          <div className="overflow-hidden rounded-lg bg-white/75 p-4 shadow-sm">
            <p className="mb-4 text-xs text-ink-faint">
              Exportiere alle Gedanken als JSON (nur Text) oder als ZIP (inkl. Fotos).
            </p>
            <div className="flex flex-col gap-3">
              <ExportButton
                label="Als JSON exportieren"
                sublabel="Alle Texte + Metadaten"
                onClick={handleExportJSON}
                disabled={exportStatus === 'running'}
              />
              <ExportButton
                label="Als ZIP exportieren"
                sublabel={
                  zipProgress
                    ? `Foto ${zipProgress.current} von ${zipProgress.total}…`
                    : 'JSON + alle Fotos'
                }
                onClick={handleExportZIP}
                disabled={exportStatus === 'running'}
              />
            </div>
            {exportStatus === 'done' && (
              <p className="mt-3 text-xs text-mint">Export gestartet.</p>
            )}
            {exportStatus === 'error' && (
              <p className="mt-3 text-xs text-pink">Export fehlgeschlagen.</p>
            )}
          </div>
        </Section>

        {/* UX-Standard: 3 passive Feature-Hints — kein Modal, keine Tour, nur hier sichtbar */}
        <Section title="Was die App kann">
          <div className="overflow-hidden rounded-lg bg-white/75 p-4 shadow-sm">
            <ul className="flex flex-col gap-2.5">
              {[
                'tipp auf einen Eintrag — ähnliche Gedanken erscheinen darunter.',
                'rückblick erscheint nach einer Woche mit einem alten Eintrag.',
                'alle Daten liegen lokal auf diesem Gerät, nirgendwo sonst.',
              ].map((hint) => (
                <li key={hint} className="flex items-start gap-2 text-xs text-ink-soft">
                  <span className="mt-0.5 shrink-0 text-accent-deep">·</span>
                  {hint}
                </li>
              ))}
            </ul>
          </div>
        </Section>

        <Section title="App">
          <div className="overflow-hidden rounded-lg bg-white/75 p-4 shadow-sm">
            <InfoRow label="Version" value="0.1.0 POC" />
            <InfoRow label="Tech" value="React + Vite + Dexie" />
          </div>
        </Section>
      </main>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="w-full max-w-xl">
      <h2 className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-ink-faint">{title}</h2>
      {children}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-sm text-ink-soft">{label}</span>
      <span className="text-sm font-medium text-ink">{value}</span>
    </div>
  );
}

function ExportButton({ label, sublabel, onClick, disabled }: {
  label: string; sublabel: string; onClick: () => void; disabled: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex w-full items-center justify-between rounded-md border border-rule px-4 py-3 text-left transition hover:border-accent/30 hover:bg-accent-soft/30 disabled:opacity-50"
    >
      <div>
        <div className="text-sm font-medium text-ink">{label}</div>
        <div className="text-xs text-ink-faint">{sublabel}</div>
      </div>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="shrink-0 text-ink-faint">
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
      </svg>
    </button>
  );
}
