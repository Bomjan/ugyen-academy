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
        accent:    "#C8920A",   /* school gold — refined from logo yellow band  */
        "accent-h":"#DCA50C",   /* hover — brighter gold                         */
        gold:      "#F5C800",   /* pure logo yellow — for decorative use         */
        "gold-lt": "#FFD84D",   /* lighter gold — hover states on hero           */
        orange:    "#F06400",   /* logo name-band orange — badges, highlights    */
        navy:      "#00004A",   /* logo outline navy                             */
        "sky-lt":  "#B8CCE0",   /* pale sky — muted text on hero dark bg         */
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
