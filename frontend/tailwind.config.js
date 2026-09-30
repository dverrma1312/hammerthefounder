/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0a0a0a',
        surface: '#111111', 
        'surface-2': '#1a1a1a',
        border: 'rgba(255,255,255,0.08)',
        'border-strong': 'rgba(255,255,255,0.15)',
        text: '#f5f5f0',
        'text-secondary': 'rgba(245,245,240,0.6)',
        'text-muted': 'rgba(245,245,240,0.35)',
        accent: '#c45a3c',
        'accent-hover': '#d4694b',
        success: '#2d9a3e',
        warning: '#d4a82b',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
