/**
 * BrainDump Design Tokens
 * Aus handoff/DESIGN-TOKENS.md
 */

export const color = {
  bg: {
    default: '#fdfaf6',
    card: '#ffffff',
    subtle: '#fbf8f3',
  },
  ink: {
    default: '#2a2138',
    soft: '#5d5168',
    faint: '#9a8fa8',
    veryFaint: '#cfc6d8',
  },
  accent: {
    default: '#b67cf5',
    deep: '#7c4dd8',
    soft: '#ead9ff',
  },
  secondary: {
    pink: '#f5a6b8',
    pinkSoft: '#fde4ea',
    peach: '#f7b59a',
    peachSoft: '#fde4d8',
    sky: '#88b6ec',
    skySoft: '#d8e6f8',
    mint: '#9bd4b5',
    mintSoft: '#dcf0e4',
  },
  rule: {
    default: 'rgba(42,33,56,0.08)',
    strong: 'rgba(42,33,56,0.14)',
  },
  gradient: {
    bg: 'linear-gradient(165deg, #ffe5dc 0%, #ffd0e2 30%, #e1d2ff 65%, #cfe5ff 100%)',
    bgSoft: 'linear-gradient(165deg, #fff4ee 0%, #ffe4ee 55%, #ece2ff 100%)',
    accent: 'linear-gradient(135deg, #b67cf5, #7c4dd8)',
  },
} as const;

export const font = {
  display: '"Fraunces", "Source Serif Pro", Georgia, serif',
  ui: '"Plus Jakarta Sans", -apple-system, "Segoe UI", sans-serif',
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 22,
  pill: 999,
} as const;

export const shadow = {
  sm: '0 1px 2px rgba(80,50,120,0.08)',
  md: '0 3px 10px rgba(80,50,120,0.10)',
  lg: '0 6px 24px rgba(80,50,120,0.12)',
  xl: '0 20px 60px rgba(80,50,120,0.25)',
} as const;

export const type = {
  display: { size: 28, weight: 500, lineHeight: 1.2, tracking: '-0.02em' },
  h2: { size: 22, weight: 500, lineHeight: 1.25, tracking: '-0.01em' },
  body: { size: 14, weight: 400, lineHeight: 1.55, tracking: '-0.005em' },
  bodySmall: { size: 12, weight: 400, lineHeight: 1.5 },
  label: { size: 11, weight: 600, lineHeight: 1.4 },
  meta: {
    size: 10,
    weight: 600,
    lineHeight: 1.2,
    tracking: '0.08em',
    transform: 'uppercase',
  },
} as const;

export const breakpoints = {
  mobile: 0,
  tablet: 640,
  desktop: 768,
  wide: 1024,
} as const;

/** Max content width on desktop to avoid full-bleed gradient on 1920px monitors */
export const maxContentWidth = 840;
