export default {
  darkMode: "class", // Class-based dark mode enabled
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#ff69b4", // Light Pink (for buttons & accents)
        secondary: "#f3f4f6", // Light Gray (for input backgrounds)
        dark: "#1e293b", // Dark mode background
      },
      boxShadow: {
        custom: "0 4px 10px rgba(0, 0, 0, 0.1)", // Soft shadow for cards
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"), // Improves form styling
    require("@tailwindcss/typography"), // Better text styling
  ],
};
