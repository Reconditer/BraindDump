/** @type {import('tailwindcss').Config} */
const preset = {
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#fdfaf6',
          card: '#ffffff',
          subtle: '#fbf8f3',
        },
        ink: {
          DEFAULT: '#2a2138',
          soft: '#5d5168',
          faint: '#9a8fa8',
          'very-faint': '#cfc6d8',
        },
        accent: {
          DEFAULT: '#b67cf5',
          deep: '#7c4dd8',
          soft: '#ead9ff',
        },
        // Top-level aliases used throughout the app (text-pink, bg-pink-soft, etc.)
        pink: {
          DEFAULT: '#f5a6b8',
          soft: '#fde4ea',
        },
        peach: {
          DEFAULT: '#f7b59a',
          soft: '#fde4d8',
        },
        sky: {
          DEFAULT: '#88b6ec',
          soft: '#d8e6f8',
        },
        mint: {
          DEFAULT: '#9bd4b5',
          soft: '#dcf0e4',
        },
        rule: {
          DEFAULT: 'rgba(42,33,56,0.08)',
          strong: 'rgba(42,33,56,0.14)',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', '"Source Serif Pro"', 'Georgia', 'serif'],
        ui: ['"Plus Jakarta Sans"', '-apple-system', '"Segoe UI"', 'sans-serif'],
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '22px',
        pill: '999px',
      },
      boxShadow: {
        sm: '0 1px 2px rgba(80,50,120,0.08)',
        md: '0 3px 10px rgba(80,50,120,0.10)',
        lg: '0 6px 24px rgba(80,50,120,0.12)',
        xl: '0 20px 60px rgba(80,50,120,0.25)',
      },
      backgroundImage: {
        'grad-bg': 'linear-gradient(165deg, #ffe5dc 0%, #ffd0e2 30%, #e1d2ff 65%, #cfe5ff 100%)',
        'grad-bg-soft': 'linear-gradient(165deg, #fff4ee 0%, #ffe4ee 55%, #ece2ff 100%)',
        'grad-accent': 'linear-gradient(135deg, #b67cf5, #7c4dd8)',
      },
      maxWidth: {
        content: '840px',
      },
      screens: {
        tablet: '640px',
        desktop: '768px',
        wide: '1024px',
      },
    },
  },
};

export default preset;
