import { jsx as _jsx } from "react/jsx-runtime";
const LABELS = {
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
export function SaveStatusIndicator({ status }) {
    const label = LABELS[status];
    if (!label)
        return null;
    const color = status === 'error'
        ? 'text-pink'
        : status === 'saved'
            ? 'text-ink-faint'
            : 'text-ink-very-faint';
    return (_jsx("span", { className: `text-xs font-medium ${color} ${status === 'saved' ? 'bd-saved-indicator' : ''}`, "aria-live": "polite", children: label }));
}
//# sourceMappingURL=SaveStatusIndicator.js.map