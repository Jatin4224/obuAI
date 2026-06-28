/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#1A1A2E",
        accent: "#FF6B35",
        secondary: "#4ECDC4",
        success: "#2ECC71",
        warning: "#F39C12",
        surface: "#F8F9FA",
        muted: "#9B9B9B",
        border: "#EBEBEB",
      },
      borderRadius: {
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "24px",
      },
    },
  },
  plugins: [],
};
