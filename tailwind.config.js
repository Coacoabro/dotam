/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'black-gradient': 'linear-gradient(180deg, #141827 0%, #0B0D1C 100%)',
        'border-fade': 'linear-gradient(180deg, rgba(168, 201, 244, 0.55) 0%, rgba(168, 201, 244, 0) 100%)',
        'gray-gradient': 'linear-gradient(180deg, rgba(168, 201, 244, 0.16) 0%, rgba(67, 80, 97, 0.16) 100%)',
        'search-border': 'linear-gradient(94.42deg, rgba(255, 255, 255, 0.0576) -12.8%, rgba(255, 255, 255, 0.192) 9.71%, rgba(255, 255, 255, 0.0768) 29.28%, rgba(255, 255, 255, 0.24) 53.25%, rgba(255, 255, 255, 0.0384) 72.33%, rgba(255, 255, 255, 0.192) 88.96%)',
        'left-talent-gradient': 'linear-gradient(90deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0) 95.38%)',
        'left-talent-border': 'linear-gradient(90deg, #A8C9F4 100%, rgba(168, 201, 244, 0) 25%)',
        'right-talent-gradient': 'linear-gradient(270deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0) 97.66%)',
        'right-talent-border': 'linear-gradient(270deg, rgba(168, 201, 244, 0) 25%, #A8C9F4 100%)',
        'talent-circle-border': 'linear-gradient(315deg, rgba(168, 201, 244, 0.8) 0%, rgba(168, 201, 244, 0.16) 100%)',
      },
      fontSize: {
        '2xs': '0.65rem',
      },
      gridTemplateColumns: {
        '17': 'repeat(17, minmax(0, 1fr))',
      },
      colors: {
        'slate-950': '#0B0D1C',
        'slate-900': '#1A1C31',
        'slate-800': '#22253F',
        'cyan-300': '#a8c9f4',
        'cyan-200': '#E2E8F6',
        'gold-400': '#F4D35C'
      },
      screens: {
        'xl-full': '1900px',
      },
    },
  },
  plugins: [],
};