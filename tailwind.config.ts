import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    'border-red-500',
    'border-yellow-500',
    'border-green-500',
    'border-transparent',
  ],
  theme: {},
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};
export default config;
