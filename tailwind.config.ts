import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        'bg-alt': 'var(--bg-alt)',
        card: 'var(--card)',
        'card-hover': 'var(--card-hover)',
        neon: 'var(--neon)',
        cyan: 'var(--cyan)',
        purple: 'var(--purple)',
        pink: 'var(--pink)',
        yellow: 'var(--yellow)',
        red: 'var(--red)',
        white: 'var(--white)',
        text: 'var(--text)',
        dim: 'var(--dim)',
        border: 'var(--border)',
        'border-bright': 'var(--border-bright)'
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        mono: ['Space Mono', 'monospace']
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' }
        },
        marqueeR: {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0)' }
        },
        pulseSoft: {
          '0%,100%': { opacity: '1' },
          '50%': { opacity: '0.45' }
        },
        floaty: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' }
        },
        glitch1: {
          '0%,100%': { transform: 'translate(0,0)' },
          '20%': { transform: 'translate(-3px,2px)' },
          '40%': { transform: 'translate(3px,-1px)' },
          '60%': { transform: 'translate(-1px,1px)' },
          '80%': { transform: 'translate(2px,-2px)' }
        },
        glitch2: {
          '0%,100%': { transform: 'translate(0,0)' },
          '15%': { transform: 'translate(2px,-2px)' },
          '35%': { transform: 'translate(-2px,1px)' },
          '55%': { transform: 'translate(3px,2px)' },
          '75%': { transform: 'translate(-1px,-1px)' }
        },
        heroFade: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        fadeInTerminal: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        gradientSpin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        }
      },
      animation: {
        marquee: 'marquee 32s linear infinite',
        marqueeR: 'marqueeR 32s linear infinite',
        pulseSoft: 'pulseSoft 2s ease-in-out infinite',
        floaty: 'floaty 2.6s ease-in-out infinite',
        glitch1: 'glitch1 3s infinite',
        glitch2: 'glitch2 2.8s infinite',
        heroFade: 'heroFade 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        fadeInTerminal: 'fadeInTerminal 0.3s ease forwards',
        gradientSpin: 'gradientSpin 3s linear infinite'
      },
      boxShadow: {
        neon: '0 0 30px rgba(0, 255, 170, 0.25)',
        cyan: '0 0 30px rgba(0, 200, 255, 0.25)',
        card: '0 30px 80px rgba(0, 0, 0, 0.35)'
      }
    }
  },
  plugins: []
};

export default config;
