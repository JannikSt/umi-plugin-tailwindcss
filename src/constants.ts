export const tailwindcssContent = `/* purgecss start ignore */
@tailwind base;
@tailwind components;
@tailwind utilities;
/* purgecss end ignore */
`;

export const tailwindConfigJS = `
/** @type {import('tailwindcss').Config} */ 
module.exports = {
  content: ['./src/**/*.html', './src/**/*.tsx', './src/**/*.ts'],
  theme: {
    extend: {},
  },
  plugins: [],
}
`;
