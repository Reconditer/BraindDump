import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate } from 'react-router-dom';
const ONBOARDING_KEY = 'bd-onboarding-done';
export function hasSeenOnboarding() {
    try {
        return localStorage.getItem(ONBOARDING_KEY) === '1';
    }
    catch {
        return false;
    }
}
export function markOnboardingDone() {
    try {
        localStorage.setItem(ONBOARDING_KEY, '1');
    }
    catch { /* ignore */ }
}
/**
 * UC5 · Stilles Onboarding — exakt nach Prototyp-Vorlage (S2_UC5).
 *
 * Headline: "Schreib einfach los." (Fraunces, "los." italic in Akzentfarbe)
 * Subtext: Keine Tags. Keine Ordner. Keine Einrichtung.
 * CTA: "Ersten Gedanken festhalten →"
 */
export function OnboardingRoute() {
    const navigate = useNavigate();
    const handleStart = () => {
        markOnboardingDone();
        navigate('/', { replace: true });
    };
    return (_jsxs("div", { className: "flex flex-1 flex-col px-8 pt-8 pb-10 desktop:px-12 desktop:pt-16", children: [_jsx("div", { className: "mb-14", children: _jsx("span", { className: "bd-label text-ink-faint", children: "1 / 1" }) }), _jsxs("div", { className: "flex-1", children: [_jsx("div", { className: "bd-meta mb-6 text-accent-deep", children: "Willkommen" }), _jsxs("h1", { className: "bd-display mb-7 text-ink", style: { fontSize: 38, lineHeight: 1.15 }, children: ["Schreib einfach", ' ', _jsx("span", { className: "bd-display-italic text-accent-deep", children: "los." })] }), _jsxs("p", { className: "bd-body mb-4 max-w-[260px] text-ink-soft", style: { lineHeight: 1.65 }, children: ["Keine Tags. Keine Ordner.", _jsx("br", {}), "Keine Einrichtung."] }), _jsxs("p", { className: "bd-body max-w-[260px] text-ink-soft", style: { lineHeight: 1.65 }, children: ["Wir k\u00FCmmern uns um Struktur \u2014", _jsx("br", {}), "du um Gedanken."] })] }), _jsxs("div", { className: "pb-2", children: [_jsx("button", { type: "button", onClick: handleStart, className: "w-full rounded-xl py-4 text-[15px] font-semibold text-white shadow-lg transition hover:opacity-90 active:scale-[0.98]", style: {
                            background: 'linear-gradient(135deg, var(--bd-accent), var(--bd-accent-deep))',
                            boxShadow: '0 4px 18px rgba(182,124,245,0.45)',
                        }, children: "Ersten Gedanken festhalten \u2192" }), _jsx("p", { className: "bd-body-sm mt-4 text-center text-ink-faint", style: { fontSize: 11 }, children: "Du kannst alles sp\u00E4ter \u00E4ndern." })] })] }));
}
//# sourceMappingURL=OnboardingRoute.js.map