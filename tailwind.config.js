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
        brand: {
          bg: {
            light: '#f4f4f5', // zinc-100
            dark: '#09090b',  // near-black
          },
          card: {
            light: '#ffffff',
            dark: '#0c0c0f',  // deep charcoal
          },
          border: {
            light: '#e4e4e7', // zinc-200
            dark: '#1e1e24',  // thin border charcoal
          },
          violet: '#8b5cf6',
          cyan: '#06b6d4',
          magenta: '#d946ef',
          blue: '#3b82f6',
        }
      },
      fontFamily: {
        sans: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'float-slow': 'float 8s ease-in-out infinite',
        'float-medium': 'float 5s ease-in-out infinite',
        'spin-slow': 'spin-slow 20s linear infinite',
        'spin-reverse': 'spin-reverse 15s linear infinite',
        'marquee': 'marquee 30s linear infinite',
        'glow': 'glow 3s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-12px) rotate(2deg)' },
        },
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'spin-reverse': {
          '0%': { transform: 'rotate(360deg)' },
          '100%': { transform: 'rotate(0deg)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        glow: {
          '0%': { filter: 'drop-shadow(0 0 2px rgba(139, 92, 246, 0.3))' },
          '100%': { filter: 'drop-shadow(0 0 12px rgba(6, 182, 212, 0.8))' },
        }
      },
      boxShadow: {
        // Neumorphic shadows
        'neu-out-dark': '9px 9px 16px #050506, -9px -9px 16px #131318',
        'neu-in-dark': 'inset 9px 9px 16px #050506, inset -9px -9px 16px #131318',
        'neu-out-light': '9px 9px 16px #d1d1d6, -9px -9px 16px #ffffff',
        'neu-in-light': 'inset 9px 9px 16px #d1d1d6, inset -9px -9px 16px #ffffff',
        // Claymorphic shadows
        'clay-dark': '10px 10px 20px rgba(0,0,0,0.3), inset 4px 4px 8px rgba(255,255,255,0.05), inset -4px -4px 8px rgba(0,0,0,0.5)',
        'clay-light': '10px 10px 20px rgba(0,0,0,0.08), inset 4px 4px 8px rgba(255,255,255,0.8), inset -4px -4px 8px rgba(0,0,0,0.15)',
        // Glow effect shadow
        'glow-violet': '0 0 15px rgba(139, 92, 246, 0.5)',
        'glow-cyan': '0 0 15px rgba(6, 182, 212, 0.5)',
      }
    },
  },
  plugins: [],
}
