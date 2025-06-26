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
      borderRadius: {
        // Custom border radius values for iOS-like elements
        "3xl": "1.5rem", // 24px - Used for buttons
        "4xl": "2rem", // 32px - May be used for larger cards/modals
        "5xl": "2.5rem", // 40px
      },
      boxShadow: {
        // Custom shadows for iOS glass effect
        "custom-light-lg":
          "0 10px 30px rgba(0, 0, 0, 0.08), 0 2px 10px rgba(0, 0, 0, 0.05)",
        "custom-light-xl":
          "0 20px 40px rgba(0, 0, 0, 0.12), 0 5px 15px rgba(0, 0, 0, 0.08)",
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
          "backdrop-filter": "blur(24px)",
        },
      };
      addUtilities(newUtilities, ["responsive", "hover"]);
    },
  ],
};
