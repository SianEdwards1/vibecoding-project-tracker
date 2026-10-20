/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      // Tokens from DESIGN.md §2. Use these, don't hard-code hex values.
      colors: {
        brand: {
          primary: '#0777da', // header, "+" button, focus rings
          accent: '#0b5cad',  // highlights, hover states, links
        },
        surface: {
          page: '#f8f4ee',
          card: '#ffffff',
        },
        text: {
          primary: '#04121f',
          muted: '#5a5758',
        },
        border: {
          subtle: '#ece7df', // card and input borders
        },
        type: {
          feature: '#5b4bb5', // M6 tag-style
          bug: '#b42318',
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
        },
        avatar: {
          // M7 task-owner: one per teammate, white initials on each pass WCAG AA
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
