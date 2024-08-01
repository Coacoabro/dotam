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
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
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
      },
    },
  },
  plugins: [],
};