import { useEffect } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { InstallBanner } from '@/features/install/InstallBanner';

/**
 * App-Shell:
 * - Aurora gradient background
 * - Mobile (<768px):  Content + Bottom-Tab-Bar
 * - Desktop (≥768px): Sidebar links + Content rechts, max 840px
 */
export function AppLayout() {
  const navigate = useNavigate();

  // UX-Standard: Keyboard-Shortcuts für Desktop (lean — nur Event-Listener, keine UI)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().includes('MAC');
      const modKey = isMac ? e.metaKey : e.ctrlKey;
      const tag = (document.activeElement?.tagName ?? '').toLowerCase();
      const isEditing = tag === 'textarea' || tag === 'input';

      // Cmd/Ctrl+K → Suche öffnen (überall)
      if (modKey && e.key === 'k') {
        e.preventDefault();
        navigate('/timeline?search=1');
        return;
      }

      // Esc → zurück zur Timeline (wenn Detail-View offen)
      if (e.key === 'Escape' && !isEditing) {
        if (window.location.pathname.startsWith('/thought/')) {
          navigate('/timeline');
        }
        return;
      }

      // "/" aus Timeline → direkt in Editor (wenn nicht am Tippen)
      if (e.key === '/' && !isEditing) {
        if (window.location.pathname === '/timeline') {
          e.preventDefault();
          navigate('/');
        }
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [navigate]);

  return (
    <div className="relative min-h-[100dvh] w-full overflow-hidden">
      {/* Aurora background */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 bg-grad-bg" />
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 bg-white/30 desktop:bg-white/50" />

      {/* Desktop layout: Sidebar links am Rand, Content max-width zentriert */}
      <div className="flex min-h-[100dvh] w-full">

        {/* Desktop Sidebar — klebt links, außerhalb des max-width */}
        <DesktopSidebar />

        {/* Main content — max-width nur auf dem Content-Bereich */}
        <div className="flex flex-1 flex-col">
          <div
            className="mx-auto flex w-full max-w-content flex-1 flex-col"
            style={{
              paddingTop: 'var(--bd-safe-top)',
              paddingBottom: 'var(--bd-safe-bottom)',
            }}
          >
            <Outlet />
          </div>
        </div>
      </div>

      {/* Mobile Bottom Tab Bar */}
      <MobileTabBar />

      {/* Install hint */}
      <InstallBanner />
    </div>
  );
}

/* ── Desktop Sidebar (≥768px) ── */
function DesktopSidebar() {
  const location = useLocation();

  const items = [
    { to: '/', label: 'Schreiben', icon: <PenIcon />, exact: true },
    { to: '/timeline', label: 'Gedanken', icon: <ListIcon /> },
    { to: '/settings', label: 'Einstellungen', icon: <SettingsIcon /> },
  ];

  return (
    <aside className="hidden desktop:flex desktop:w-52 desktop:flex-col desktop:border-r desktop:border-rule desktop:bg-white/40 desktop:px-4 desktop:py-6 desktop:backdrop-blur-md">
      {/* Logo */}
      <div className="mb-8 flex items-center gap-2 px-3">
        <span
          className="inline-block h-2 w-2 rounded-full"
          style={{ background: 'linear-gradient(135deg, var(--bd-accent), var(--bd-accent-deep))' }}
        />
        <span className="bd-h2 text-lg text-ink">BrainDump</span>
      </div>

      {/* Nav items */}
      <nav className="flex flex-col gap-1">
        {items.map((item) => {
          const active = item.exact
            ? location.pathname === item.to
            : location.pathname.startsWith(item.to);
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              className="flex items-center gap-3 rounded-lg px-3 py-2 transition"
              style={{
                background: active ? 'var(--bd-accent-soft)' : 'transparent',
                color: active ? 'var(--bd-accent-deep)' : 'var(--bd-ink-soft)',
                fontWeight: active ? 600 : 400,
              }}
            >
              <span className="h-4 w-4 shrink-0">{item.icon}</span>
              <span className="bd-body text-[13px]">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}

/* ── Mobile Bottom Tab Bar (<768px) ── */
function MobileTabBar() {
  const items = [
    { to: '/', label: 'Schreiben', icon: <PenIcon />, exact: true },
    { to: '/timeline', label: 'Gedanken', icon: <ListIcon /> },
    { to: '/settings', label: 'Einstellungen', icon: <SettingsIcon /> },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 flex justify-around border-t border-rule desktop:hidden"
      style={{
        background: 'rgba(255,255,255,0.82)',
        backdropFilter: 'blur(20px)',
        paddingBottom: 'max(env(safe-area-inset-bottom), 8px)',
        paddingTop: '8px',
      }}
    >
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.exact}
          // UX-Standard: min 44px touch target (iOS HIG)
          className="flex min-h-[44px] flex-col items-center justify-center gap-1 px-4"
          aria-label={item.label}
        >
          {({ isActive }) => (
            <>
              <span
                className="h-6 w-6 transition"
                style={{ color: isActive ? 'var(--bd-accent-deep)' : 'var(--bd-ink-faint)' }}
                aria-hidden="true"
              >
                {item.icon}
              </span>
              <span
                className="text-[0.625rem] font-semibold"
                style={{ color: isActive ? 'var(--bd-accent-deep)' : 'var(--bd-ink-faint)' }}
              >
                {item.label}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}

/* ── Icons ── */
function PenIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="100%" height="100%">
      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}
function ListIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" width="100%" height="100%">
      <path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01" />
    </svg>
  );
}
function SettingsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" width="100%" height="100%">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  );
}
