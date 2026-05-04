/**
 * Tailwind preset that wires design tokens into Tailwind theme.
 * Used via tailwind.config.ts: `presets: [require('@braindump/design-tokens/tailwind')]`
 */
/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: 'var(--bd-bg-default)',
          card: 'var(--bd-bg-card)',
          subtle: 'var(--bd-bg-subtle)',
        },
        ink: {
          DEFAULT: 'var(--bd-ink-default)',
          soft: 'var(--bd-ink-soft)',
          faint: 'var(--bd-ink-faint)',
          'very-faint': 'var(--bd-ink-very-faint)',
        },
        accent: {
          DEFAULT: 'var(--bd-accent)',
          deep: 'var(--bd-accent-deep)',
          soft: 'var(--bd-accent-soft)',
        },
        pink: {
          DEFAULT: 'var(--bd-pink)',
          soft: 'var(--bd-pink-soft)',
        },
        peach: {
          DEFAULT: 'var(--bd-peach)',
          soft: 'var(--bd-peach-soft)',
        },
        sky: {
          DEFAULT: 'var(--bd-sky)',
          soft: 'var(--bd-sky-soft)',
        },
        mint: {
          DEFAULT: 'var(--bd-mint)',
          soft: 'var(--bd-mint-soft)',
        },
        rule: {
          DEFAULT: 'var(--bd-rule)',
          strong: 'var(--bd-rule-strong)',
        },
      },
      fontFamily: {
        display: 'var(--bd-font-display)',
        ui: 'var(--bd-font-ui)',
      },
      borderRadius: {
        sm: 'var(--bd-radius-sm)',
        md: 'var(--bd-radius-md)',
        lg: 'var(--bd-radius-lg)',
        xl: 'var(--bd-radius-xl)',
        pill: 'var(--bd-radius-pill)',
      },
      boxShadow: {
        sm: 'var(--bd-shadow-sm)',
        md: 'var(--bd-shadow-md)',
        lg: 'var(--bd-shadow-lg)',
        xl: 'var(--bd-shadow-xl)',
      },
      backgroundImage: {
        'grad-bg': 'var(--bd-grad-bg)',
        'grad-bg-soft': 'var(--bd-grad-bg-soft)',
        'grad-accent': 'var(--bd-grad-accent)',
      },
      maxWidth: {
        content: 'var(--bd-max-content-width)',
      },
      screens: {
        tablet: '640px',
        desktop: '768px',
        wide: '1024px',
      },
    },
  },
};
