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
        background: '#020617',
        foreground: '#F8FAFC',
        card: {
          DEFAULT: '#0E1223',
          foreground: '#F8FAFC',
          hover: '#13182E',
        },
        primary: {
          DEFAULT: '#0F172A',
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#1E293B',
          foreground: '#FFFFFF',
        },
        accent: {
          DEFAULT: '#22C55E',
          foreground: '#0F172A',
          hover: '#16A34A',
          muted: 'rgba(34, 197, 94, 0.15)',
        },
        muted: {
          DEFAULT: '#1A1E2F',
          foreground: '#94A3B8',
        },
        border: '#334155',
        destructive: {
          DEFAULT: '#EF4444',
          foreground: '#FFFFFF',
          muted: 'rgba(239, 68, 68, 0.15)',
        },
        warning: {
          DEFAULT: '#F59E0B',
          foreground: '#0F172A',
          muted: 'rgba(245, 158, 11, 0.15)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'glow-accent': '0 0 20px -5px rgba(34, 197, 94, 0.3)',
        'glow-destructive': '0 0 20px -5px rgba(239, 68, 68, 0.3)',
        'glow-warning': '0 0 20px -5px rgba(245, 158, 11, 0.3)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
