/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // ── Primary Palette (5-shade scale from design system) ───────────────
        // Dark → Light: Primary Base, Dark Gray, Gray, Light, Background
        primary:     "#1A1A1A",   // Primary Base — near-black (buttons, headlines)
        "primary-dark": "#0D0D0D", // Darkest shade
        gray:        "#717171",   // Mid neutral
        "gray-light": "#D4D4D4", // Light neutral
        "gray-dark": "#3D3D3D",  // Dark neutral / Dark Drop

        // ── Accent Colors (Color Harmony from design system) ─────────────────
        accent:    "#FF6B35",   // Omarosa — orange, primary CTA
        cobalt:    "#4F46E5",   // Nova — indigo/blue
        gold:      "#EAB308",   // Cobra — yellow/gold
        sky:       "#0EA5E9",   // Sky — light blue
        danger:    "#EF4444",   // Target — red/alert

        // ── Semantic / Functional ─────────────────────────────────────────────
        secondary: "#4ECDC4",  // Teal — protein bars, secondary stats
        success:   "#2ECC71",  // Green — goals met
        warning:   "#F39C12",  // Amber — reminders
        error:     "#EF4444",  // Red — errors (alias of danger)

        // ── Surface / Background ──────────────────────────────────────────────
        background: "#FFFFFF",  // Page background
        surface:    "#F8F9FA",  // Card / input background
        "surface-2": "#F0F0F0", // Elevated surface

        // ── Text ──────────────────────────────────────────────────────────────
        muted:      "#9B9B9B",  // Secondary text, placeholders

        // ── Border ────────────────────────────────────────────────────────────
        border:     "#EBEBEB",  // Dividers, card outlines
        "border-strong": "#CBCBCB", // Stronger dividers
      },

      // ── Type Scale (SF Pro Display — from design system right panel) ────────
      fontSize: {
        "display-lg": ["48px", { lineHeight: "56px", letterSpacing: "-1px" }],
        "display-md": ["36px", { lineHeight: "44px", letterSpacing: "-0.5px" }],
        "heading":    ["28px", { lineHeight: "36px", letterSpacing: "-0.3px" }],
        "subheading": ["22px", { lineHeight: "30px", letterSpacing: "-0.2px" }],
        "body-lg":    ["18px", { lineHeight: "28px" }],
        "body":       ["16px", { lineHeight: "24px" }],
        "body-sm":    ["14px", { lineHeight: "20px" }],
        "caption":    ["12px", { lineHeight: "16px" }],
        "overline":   ["11px", { lineHeight: "14px", letterSpacing: "0.5px" }],
      },

      // ── Font Weight ───────────────────────────────────────────────────────
      fontWeight: {
        regular:     "400",
        medium:      "500",
        semibold:    "600",
        bold:        "700",
        extrabold:   "800",
      },

      // ── Border Radius (from Radius System panel) ──────────────────────────
      borderRadius: {
        none:  "0px",
        xs:    "4px",
        sm:    "8px",
        md:    "12px",
        lg:    "16px",
        xl:    "24px",
        "2xl": "32px",
        "3xl": "40px",
        full:  "9999px",
      },

      // ── Spacing (4px base unit — matches design system spacing grid) ──────
      spacing: {
        "0.5": "2px",
        "1":   "4px",
        "2":   "8px",
        "3":   "12px",
        "4":   "16px",
        "5":   "20px",
        "6":   "24px",
        "7":   "28px",
        "8":   "32px",
        "10":  "40px",
        "12":  "48px",
        "14":  "56px",
        "16":  "64px",
        "20":  "80px",
        "24":  "96px",
      },

      // ── Shadow System (from Shadow Set + Drop Set in design system) ────────
      boxShadow: {
        xs:  "0px 1px 2px rgba(0, 0, 0, 0.05)",
        sm:  "0px 2px 4px rgba(0, 0, 0, 0.08)",
        md:  "0px 4px 12px rgba(0, 0, 0, 0.10)",
        lg:  "0px 8px 24px rgba(0, 0, 0, 0.12)",
        xl:  "0px 16px 40px rgba(0, 0, 0, 0.14)",
        // Drop Set — softer, more diffuse
        "drop-sm": "0px 2px 8px rgba(0, 0, 0, 0.06)",
        "drop-md": "0px 4px 16px rgba(0, 0, 0, 0.08)",
        "drop-lg": "0px 8px 32px rgba(0, 0, 0, 0.10)",
        // Accent glow (for CTA highlights)
        "accent":  "0px 4px 16px rgba(255, 107, 53, 0.30)",
      },
    },
  },
  plugins: [],
};
