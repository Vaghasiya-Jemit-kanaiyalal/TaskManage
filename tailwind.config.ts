import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      colors: {
        surface: 'rgb(var(--surface) / <alpha-value>)',
        muted: 'rgb(var(--muted) / <alpha-value>)',
        accent: '#8b9cff',
        glass: 'rgb(var(--glass) / <alpha-value>)',
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgb(0 0 0 / 0.35)',
        inner: 'inset 0 1px 0 0 rgb(255 255 255 / 0.06)',
      },
      backdropBlur: {
        glass: '20px',
      },
    },
  },
  plugins: [],
}

export default config
