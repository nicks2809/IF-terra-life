/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        prts: {
          bg: '#0b0d11',
          card: '#13171f',
          border: '#1f2937',
          cyan: '#00e5ff',
          'cyan-dim': '#00838f',
          amber: '#f59e0b',
          hazard: '#ef4444',
          subtext: '#94a3b8',
        },
        tome: {
          bg: '#f4ebd0',
          card: '#e8dcbe',
          border: '#5c4033',
          ink: '#1a1412',
          subtext: '#5c4d47',
          wax: '#8b1e1e',
          gold: '#b8860b'
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
        serif: ['Song Myung', 'Noto Serif KR', 'Batang', 'serif'],
      }
    },
  },
  plugins: [],
}
