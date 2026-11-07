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
        background: '#080B16',
        'secondary-bg': '#111827',
        'card-bg': '#182235',
        'card-border': '#26344d',
        primary: {
          DEFAULT: '#6366F1',
          hover: '#4F46E5',
          light: '#818CF8'
        },
        cyan: {
          accent: '#22D3EE'
        },
        'text-primary': '#F9FAFB',
        'text-secondary': '#94A3B8',
        success: '#22C55E',
        warning: '#F59E0B',
        danger: '#EF4444',
        elevated: '#F97316'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Space Grotesk', 'sans-serif']
      },
      boxShadow: {
        'cyber': '0 0 25px -5px rgba(99, 102, 241, 0.25)',
        'cyber-cyan': '0 0 25px -5px rgba(34, 211, 238, 0.25)',
        'danger-glow': '0 0 25px -5px rgba(239, 68, 68, 0.35)'
      }
    },
  },
  plugins: [],
}
