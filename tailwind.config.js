/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        '24': 'repeat(24,minmax(0, 1fr))',
        '17': 'repeat(17,minmax(0, 1fr))',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      width: {
        '14': '3.5rem', // You can adjust the value as needed
        '16': '4rem',   // You can adjust the value as needed
      },
    },
    fontSize: {
        '2xs': ['10px', '15px'],
    }
  },
  plugins: [],
}
