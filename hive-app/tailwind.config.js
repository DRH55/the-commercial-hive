/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        amber: "#C6752B",
        "amber-light": "#E7A45D",
        bg: "#FFFFFF",
        cream: "#FAF5EA",
        "cream-deep": "#F1E9D8",
        charcoal: "#211D1A",
        "charcoal-soft": "#4A423A",
        gold: "#B8934A",
        line: "rgba(33,29,26,0.11)",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Inter", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
