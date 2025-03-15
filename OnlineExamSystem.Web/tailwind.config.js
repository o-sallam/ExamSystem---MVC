/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',

  content: [
    "./*.{html,js}",
    "./Views/**/*.cshtml", // Add Razor views
    "./Areas/Admin/Views/**/*.cshtml", // Add Admin Razor views
    "./wwwroot/**/*.{html,js,cshtml}" // Include all relevant files
  ],  theme: {
    extend: {
      colors: {
        primary: '#6c5ce7',
        secondary: '#a29bfe',
        accent: '#fd79a8',
        success: '#00b894',
        warning: '#fdcb6e',
        danger: '#e17055',
        dark: '#2d3436',
        darkbg: '#1a202c',
        darkprimary: '#4834d4',
        darksecondary: '#686de0',
        darkaccent: '#e84393',
        darktext: '#e2e8f0',
        darksurface: '#2d3748',
        darkborder: '#4a5568',
      },
      spacing: {
        '4': '1rem',
        '5': '1.25rem',
      },
      gap: {
        '4': '1rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-in-out forwards'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(5px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      }
    }
  },
  plugins: [],
}
