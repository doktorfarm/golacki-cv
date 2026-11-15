/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      // Colors are CSS variables so light/dark mode is handled in index.css
      colors: {
        bg: 'var(--bg)',
        'bg-2': 'var(--bg-2)',
        'bg-3': 'var(--bg-3)',
        sky: 'var(--sky)',
        fg: 'var(--fg)',
        muted: 'var(--muted)',
        line: 'var(--line)',
        accent: 'var(--accent)',
        'accent-text': 'var(--accent-text)',
        'on-accent': 'var(--on-accent)',
      },
      fontFamily: {
        display: ['"Geist Variable"', 'Geist', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        serif: ['"Geist Variable"', 'Geist', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"Geist Variable"', 'Geist', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      maxWidth: { site: '1180px' },
      transitionTimingFunction: {
        out: 'cubic-bezier(.16,1,.3,1)',
        'in-out-expo': 'cubic-bezier(.76,0,.24,1)',
      },
    },
  },
  plugins: [],
}
