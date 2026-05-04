import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { thoughtRepository } from '@braindump/db';
import { getStorageEstimate, formatMB } from '@/utils/storage';
import { exportAsJSON, exportAsZIP } from '@/utils/export';
export function SettingsRoute() {
    const [count, setCount] = useState(null);
    const [storage, setStorage] = useState(null);
    const [exportStatus, setExportStatus] = useState('idle');
    const [zipProgress, setZipProgress] = useState(null);
    const mounted = useRef(true);
    useEffect(() => {
        mounted.current = true;
        // WICHTIG FIX: cancellation flag prevents setState after unmount
        void Promise.all([
            thoughtRepository.count(),
            getStorageEstimate(),
        ]).then(([c, s]) => {
            if (!mounted.current)
                return;
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
        }
        catch {
            setExportStatus('error');
        }
    };
    const handleExportZIP = async () => {
        setExportStatus('running');
        setZipProgress(null);
        try {
            await exportAsZIP((cur, total) => {
                if (mounted.current)
                    setZipProgress({ current: cur, total });
            });
            setExportStatus('done');
        }
        catch {
            setExportStatus('error');
        }
        finally {
            // NICE FIX: always clear progress
            if (mounted.current)
                setZipProgress(null);
        }
    };
    return (_jsxs("div", { className: "flex flex-1 flex-col", children: [_jsx("header", { className: "flex items-center px-5 pt-4 pb-4 desktop:px-8 desktop:pt-6", children: _jsx(Link, { to: "/timeline", className: "text-xs font-semibold uppercase tracking-widest text-ink-faint transition hover:text-ink-soft", children: "\u2190 zur\u00FCck" }) }), _jsxs("main", { className: "flex flex-1 flex-col gap-6 px-5 pb-10 desktop:px-8", children: [_jsx("h1", { className: "text-xl font-semibold text-ink", children: "Einstellungen" }), _jsx(Section, { title: "Speicher", children: _jsxs("div", { className: "rounded-lg bg-white/75 p-4 shadow-sm", children: [_jsxs("p", { className: "mb-3 text-xs text-ink-faint", children: ["Deine Gedanken liegen ", _jsx("strong", { children: "lokal auf diesem Ger\u00E4t" }), ". Kein Cloud-Sync."] }), count !== null && _jsx(InfoRow, { label: "Gespeicherte Gedanken", value: `${count}` }), storage && (_jsxs(_Fragment, { children: [_jsx(InfoRow, { label: "Verwendet", value: formatMB(storage.usedMB) }), _jsx(InfoRow, { label: "Verf\u00FCgbar", value: formatMB(storage.quotaMB) }), _jsx("div", { className: "mt-3 h-1.5 w-full overflow-hidden rounded-pill bg-accent-soft", children: _jsx("div", { className: "h-full rounded-pill bg-accent-deep transition-all", style: { width: `${Math.min(100, storage.usedPercent).toFixed(1)}%` } }) }), storage.usedPercent > 90 && (
                                        // UX-Standard: klarer Error-Toast mit Handlungsaufforderung
                                        _jsxs("div", { className: "mt-2 rounded-md bg-pink-soft px-3 py-2", children: [_jsx("p", { className: "text-xs font-semibold text-pink", children: "Speicher fast voll." }), _jsx("p", { className: "text-xs text-ink-soft", children: "Exportiere deine Daten und l\u00F6sche \u00E4ltere Eintr\u00E4ge." })] })), storage.usedPercent > 80 && storage.usedPercent <= 90 && (_jsx("p", { className: "mt-2 text-xs text-ink-soft", children: "Speicher zu 80 % gef\u00FCllt \u2014 Export empfohlen." }))] }))] }) }), _jsx(Section, { title: "Daten exportieren", children: _jsxs("div", { className: "rounded-lg bg-white/75 p-4 shadow-sm", children: [_jsx("p", { className: "mb-4 text-xs text-ink-faint", children: "Exportiere alle Gedanken als JSON (nur Text) oder als ZIP (inkl. Fotos)." }), _jsxs("div", { className: "flex flex-col gap-3", children: [_jsx(ExportButton, { label: "Als JSON exportieren", sublabel: "Alle Texte + Metadaten", onClick: handleExportJSON, disabled: exportStatus === 'running' }), _jsx(ExportButton, { label: "Als ZIP exportieren", sublabel: zipProgress
                                                ? `Foto ${zipProgress.current} von ${zipProgress.total}…`
                                                : 'JSON + alle Fotos', onClick: handleExportZIP, disabled: exportStatus === 'running' })] }), exportStatus === 'done' && (_jsx("p", { className: "mt-3 text-xs text-mint", children: "Export gestartet." })), exportStatus === 'error' && (_jsx("p", { className: "mt-3 text-xs text-pink", children: "Export fehlgeschlagen." }))] }) }), _jsx(Section, { title: "Was die App kann", children: _jsx("div", { className: "rounded-lg bg-white/75 p-4 shadow-sm", children: _jsx("ul", { className: "flex flex-col gap-2.5", children: [
                                    'tipp auf einen Eintrag — ähnliche Gedanken erscheinen darunter.',
                                    'rückblick erscheint nach einer Woche mit einem alten Eintrag.',
                                    'alle Daten liegen lokal auf diesem Gerät, nirgendwo sonst.',
                                ].map((hint) => (_jsxs("li", { className: "flex items-start gap-2 text-xs text-ink-soft", children: [_jsx("span", { className: "mt-0.5 shrink-0 text-accent-deep", children: "\u00B7" }), hint] }, hint))) }) }) }), _jsx(Section, { title: "App", children: _jsxs("div", { className: "rounded-lg bg-white/75 p-4 shadow-sm", children: [_jsx(InfoRow, { label: "Version", value: "0.1.0 POC" }), _jsx(InfoRow, { label: "Tech", value: "React + Vite + Dexie" })] }) })] })] }));
}
function Section({ title, children }) {
    return (_jsxs("div", { children: [_jsx("h2", { className: "mb-2 text-[10px] font-semibold uppercase tracking-widest text-ink-faint", children: title }), children] }));
}
function InfoRow({ label, value }) {
    return (_jsxs("div", { className: "flex items-center justify-between py-1", children: [_jsx("span", { className: "text-sm text-ink-soft", children: label }), _jsx("span", { className: "text-sm font-medium text-ink", children: value })] }));
}
function ExportButton({ label, sublabel, onClick, disabled }) {
    return (_jsxs("button", { type: "button", onClick: onClick, disabled: disabled, className: "flex w-full items-center justify-between rounded-md border border-rule px-4 py-3 text-left transition hover:border-accent/30 hover:bg-accent-soft/30 disabled:opacity-50", children: [_jsxs("div", { children: [_jsx("div", { className: "text-sm font-medium text-ink", children: label }), _jsx("div", { className: "text-xs text-ink-faint", children: sublabel })] }), _jsx("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", className: "shrink-0 text-ink-faint", children: _jsx("path", { d: "M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" }) })] }));
}
//# sourceMappingURL=SettingsRoute.js.map