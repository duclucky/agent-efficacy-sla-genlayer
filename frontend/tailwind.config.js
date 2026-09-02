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
        background: '#030712',
        foreground: '#F9FAFB',
        card: {
          DEFAULT: '#0B0F19',
          foreground: '#F9FAFB',
          hover: '#111827',
          border: '#1F2937',
        },
        primary: {
          DEFAULT: '#0F172A',
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#111827',
          foreground: '#F3F4F6',
          border: '#374151',
        },
        accent: {
          DEFAULT: '#10B981',
          foreground: '#030712',
          hover: '#059669',
          muted: 'rgba(16, 185, 129, 0.12)',
          border: 'rgba(16, 185, 129, 0.3)',
        },
        muted: {
          DEFAULT: '#1F2937',
          foreground: '#9CA3AF',
        },
        border: '#1F2937',
        destructive: {
          DEFAULT: '#EF4444',
          foreground: '#FFFFFF',
          muted: 'rgba(239, 68, 68, 0.12)',
          border: 'rgba(239, 68, 68, 0.3)',
        },
        warning: {
          DEFAULT: '#F59E0B',
          foreground: '#030712',
          muted: 'rgba(245, 158, 11, 0.12)',
          border: 'rgba(245, 158, 11, 0.3)',
        },
        info: {
          DEFAULT: '#3B82F6',
          foreground: '#FFFFFF',
          muted: 'rgba(59, 130, 246, 0.12)',
          border: 'rgba(59, 130, 246, 0.3)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'glow-accent': '0 0 25px -5px rgba(16, 185, 129, 0.35)',
        'glow-destructive': '0 0 25px -5px rgba(239, 68, 68, 0.35)',
        'glow-warning': '0 0 25px -5px rgba(245, 158, 11, 0.35)',
        'glow-card': '0 10px 30px -10px rgba(0, 0, 0, 0.7)',
      },
      backgroundImage: {
        'radial-gradient': 'radial-gradient(circle at 50% 0%, var(--tw-gradient-stops))',
        'grid-pattern': "radial-gradient(circle at center, rgba(31, 41, 55, 0.4) 1px, transparent 1px)",
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fadeIn': 'fadeIn 0.25s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
