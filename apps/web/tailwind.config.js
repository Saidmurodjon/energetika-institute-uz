/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f4ff',
          100: '#dce8ff',
          200: '#b8d0ff',
          300: '#85aeff',
          400: '#4d80ff',
          500: '#1a56ff',
          600: '#0038f5',
          700: '#002cd1',
          800: '#0026aa',
          900: '#001f85',
          950: '#001260',
        },
        accent: {
          50: '#fff8ed',
          100: '#ffeed5',
          200: '#fed9a8',
          300: '#fdbc70',
          400: '#fb9537',
          500: '#f97414',
          600: '#ea5a0a',
          700: '#c2430b',
          800: '#9a3611',
          900: '#7c2e12',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
