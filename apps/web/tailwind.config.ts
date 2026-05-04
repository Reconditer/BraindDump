import type { Config } from 'tailwindcss';
import preset from '@braindump/design-tokens/tailwind';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  presets: [preset],
} satisfies Config;
