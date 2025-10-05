import daisyui from 'daisyui';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
    },
  },
  plugins: [
    daisyui,
  ],
  daisyui: {
    themes: [
      {
        echo: {

          "primary": "#cacaca",

          "secondary": "#cacaca",

          "accent": "#adb5bd",

          "neutral": "#020205",

          "base-100": "#020205",

          "info": "#cacaca",

          "success": "#cacaca",

          "warning": "#cacaca",

          "error": "#cacaca",
        },
      },
    ],
  },
};