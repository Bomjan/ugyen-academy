/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        dark:      "#0A0A0C",
        "dark-2":  "#141416",
        "dark-3":  "#1C1C1E",
        surface:   "#F5F5F7",
        border:    "#E5E5EA",
        text:      "#1D1D1F",
        muted:     "#6E6E73",
        accent:    "#0066CC",
        "accent-h":"#0077ED",
      },
      fontFamily: {
        sans:    ["'Inter'",            "system-ui", "sans-serif"],
        wordmark:["'Plus Jakarta Sans'","system-ui", "sans-serif"],
      },
      boxShadow: {
        card:  "0 2px 8px rgba(0,0,0,0.08)",
        hover: "0 8px 30px rgba(0,0,0,0.12)",
      },
    },
  },
  plugins: [],
};
