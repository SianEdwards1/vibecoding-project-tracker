/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  // Dark mode is switched on by a "dark" class on <html>, set by the header toggle.
  darkMode: 'class',
  theme: {
    extend: {
      // Tokens from DESIGN.md §2. Use these, don't hard-code hex values.
      // Each "-dark" token is the dark mode version of its light token, used with dark: classes.
      colors: {
        brand: {
          primary: '#0777da', // header, "+" button, focus rings
          accent: '#0b5cad',  // highlights, hover states, links
          'primary-dark': '#6db3f8', // text, icons and focus rings. Solid buttons keep brand-primary
          'accent-dark': '#9ccbfa',
        },
        surface: {
          page: '#f8f4ee',
          card: '#ffffff',
          'page-dark': '#0f1b2a',
          'card-dark': '#172638',
        },
        text: {
          primary: '#04121f',
          muted: '#5a5758',
          'primary-dark': '#f1ede6',
          'muted-dark': '#b4aea5',
        },
        border: {
          subtle: '#ece7df', // card and input borders
          'subtle-dark': '#2e4159',
        },
        type: {
          feature: '#5b4bb5', // M6 tag-style
          bug: '#b42318',
          'feature-dark': '#b3a8f5',
          'bug-dark': '#ff9c8f',
        },
        due: {
          // M8 due-tint: each tint has an ink colour for text, icons or borders on it
          safe: '#def4e7',    // done
          'safe-ink': '#177a4c',
          warning: '#fdefd0', // due soon, less than 3 days left
          'warning-ink': '#8a5a00',
          overdue: '#fde3e0', // past due
          'overdue-ink': '#b42318',
          neutral: '#ece7df', // due in 3+ days
          'neutral-ink': '#5a5758',
          'safe-dark': '#123a2b',
          'safe-ink-dark': '#86dcac',
          'warning-dark': '#3d2f0d',
          'warning-ink-dark': '#f3cf75',
          'overdue-dark': '#4a1f1d',
          'overdue-ink-dark': '#ffb8ae',
          'neutral-dark': '#2e4159',
          'neutral-ink-dark': '#d3cec6',
        },
        avatar: {
          // M7 task-owner: one per teammate, white initials on each pass WCAG AA.
          // Used as they are in dark mode too.
          pink: '#be185d',
          slate: '#475569',
          cyan: '#155e75',
          orange: '#c2410c',
        },
      },
      // Fonts from DESIGN.md §3, loaded in index.html
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
};
