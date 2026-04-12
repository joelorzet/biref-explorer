/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#0B1020',
          elevated: '#0F172A',
          panel: '#141B2E',
          hover: '#1A2237',
        },
        border: {
          DEFAULT: '#1E293B',
          strong: '#334155',
        },
        ink: {
          DEFAULT: '#F8FAFC',
          muted: '#94A3B8',
          dim: '#64748B',
        },
        accent: {
          DEFAULT: '#22C55E',
          hover: '#16A34A',
          glow: '#22C55E',
        },
        brand: {
          cyan: '#06B6D4',
          violet: '#8B5CF6',
          amber: '#F59E0B',
          rose: '#F43F5E',
        },
      },
      fontFamily: {
        sans: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 24px -4px rgba(34, 197, 94, 0.35)',
        panel:
          '0 1px 0 0 rgba(255,255,255,0.03) inset, 0 8px 24px -12px rgba(0,0,0,0.6)',
      },
      animation: {
        'pulse-ring': 'pulseRing 2s ease-out infinite',
        'scan-sweep': 'scanSweep 2.4s linear infinite',
        'fade-in': 'fadeIn 200ms ease-out',
        'slide-up': 'slideUp 240ms ease-out',
        shimmer: 'shimmer 1.6s linear infinite',
      },
      keyframes: {
        pulseRing: {
          '0%': { transform: 'scale(0.9)', opacity: '0.6' },
          '80%, 100%': { transform: 'scale(1.4)', opacity: '0' },
        },
        scanSweep: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};
