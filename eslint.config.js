/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
      colors: {
        "lexi-background": "#FFFFFF",
        "lexi-headline": "#1f1235",
        "lexi-subheadline": "#1b1425",
        "lexi-button": "#ff6e6c",
        "lexi-button-text": "#1f1235",
        "lexi-illustration-stroke": "#1f1235",
        "lexi-illustration-main": "#FFFFFF",
        "lexi-illustration-highlight": "#ff6e6c",
        "lexi-illustration-secondary": "#67568c",
        "lexi-illustration-tertiary": "#fbdd74",
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        ".backdrop-filter-none": {
          "backdrop-filter": "none",
        },
        ".backdrop-blur-sm": {
          "backdrop-filter": "blur(4px)",
        },
        ".backdrop-blur-md": {
          "backdrop-filter": "blur(8px)",
        },
        ".backdrop-blur-lg": {
          "backdrop-filter": "blur(12px)",
        },
        ".backdrop-blur-xl": {
          // Added for stronger blur
          "backdrop-filter": "blur(24px)",
        },
      };
      addUtilities(newUtilities, ["responsive", "hover"]);
    },
  ],
};
