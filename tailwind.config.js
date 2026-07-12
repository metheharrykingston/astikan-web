/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#041a3d',
          900: '#072654',
          800: '#0b3974',
          700: '#144d91'
        },
        gold: {
          400: '#e7af43',
          500: '#cc922b'
        },
        skysoft: '#eef7ff',
        mint: '#49cbbd',
        violet: '#8c66ff'
      },
      boxShadow: {
        soft: '0 18px 50px rgba(24, 67, 115, 0.10)',
        card: '0 12px 35px rgba(5, 36, 84, 0.08)',
        dashboard: '0 30px 80px rgba(7, 38, 84, 0.25)'
      },
      borderRadius: {
        '4xl': '2rem'
      },
      backgroundImage: {
        'hero-radial': 'radial-gradient(circle at 74% 32%, rgba(166,211,255,.48), transparent 44%), linear-gradient(180deg,#ffffff 0%,#f4f9ff 100%)',
        'dark-grid': 'radial-gradient(circle at 82% 10%, rgba(42,122,204,.55), transparent 28%), linear-gradient(125deg,#062754 0%,#03204a 45%,#082f66 100%)'
      }
    }
  },
  plugins: []
};
