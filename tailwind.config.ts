import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
    },
    extend: {
      fontFamily: {
        quicksand: ["Quicksand", "sans-serif"],
        cherryBomb: ['"Cherry Bomb One"', "cursive"],
        sketch: ["var(--font-sketch-body)", "cursive"],
        sketchHeading: ["var(--font-sketch-heading)", "cursive"],
      },
      screens: {
        "2xsm": "375px",
        "xsm": "425px",
        "2xl": "1400px",
      },
      height: {
        "screen-dvh": "100dvh",
        "screen-svh": "100svh",
      },
      minHeight: {
        "screen-dvh": "100dvh",
        "screen-svh": "100svh",
      },
      maxHeight: {
        "screen-dvh": "100dvh",
        "screen-svh": "100svh",
      },
      colors: {
        border: "var(--border)",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        snow: "#FAFAFA",
        "app-background": "var(--app-background)",
        "app-primary": "hsl(var(--app-primary) / <alpha-value>)",
        "app-secondary": "hsl(var(--app-secondary) / <alpha-value>)",
        "app-selected": "hsl(var(--app-selected) / <alpha-value>)",
        "app-container": "var(--app-container)",
        "app-border": "var(--app-border)",
        "primary-dark": "#212529",
        "secondary-dark": "#343a40",
        "warning": "hsl(var(--warning) / <alpha-value>)",
        "success": "hsl(var(--success) / <alpha-value>)",
        "dark-button-color": "#0466c8",
        "primary-blue": "#A0CFF7",
        "secondary-blue": "#0066CC",
        title: "var(--title)",
        subtitle: "var(--subtitle)",
        paragraph: "var(--paragraph)",
        link: "var(--link)",
        action: "var(--action)",
        sketch: {
          bg: "hsl(var(--sketch-bg) / <alpha-value>)",
          fg: "hsl(var(--sketch-fg) / <alpha-value>)",
          muted: "hsl(var(--sketch-muted) / <alpha-value>)",
          accent: "hsl(var(--sketch-accent) / <alpha-value>)",
          "accent-lt": "hsl(var(--sketch-accent-lt) / <alpha-value>)",
          "accent-dk": "hsl(var(--sketch-accent-dk) / <alpha-value>)",
          danger: "hsl(var(--sketch-danger) / <alpha-value>)",
          "danger-lt": "hsl(var(--sketch-danger-lt) / <alpha-value>)",
          border: "hsl(var(--sketch-border) / <alpha-value>)",
          white: "hsl(var(--sketch-white) / <alpha-value>)",
          yellow: "hsl(var(--sketch-yellow) / <alpha-value>)",
          success: "hsl(var(--sketch-success) / <alpha-value>)",
          "success-dk": "hsl(var(--sketch-success-dk) / <alpha-value>)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "sketch-card": "var(--sketch-radius-card)",
        "sketch-wobbly": "var(--sketch-radius-wobbly)",
        "sketch-btn": "var(--sketch-radius-btn)",
        "sketch-notif": "var(--sketch-radius-notif)",
        "sketch-progress": "var(--sketch-radius-progress)",
        "sketch-footer-top": "var(--sketch-radius-footer-top)",
        "sketch-section-label": "var(--sketch-radius-section-label)",
        "sketch-nav-item": "var(--sketch-radius-nav-item)",
        "sketch-avatar": "var(--sketch-radius-avatar)",
      },
      boxShadow: {
        sketch: "var(--sketch-shadow)",
        "sketch-sm": "var(--sketch-shadow-sm)",
        "sketch-lg": "var(--sketch-shadow-lg)",
        "sketch-1": "1px 1px 0px 0px hsl(var(--sketch-border) / 1)",
        "sketch-2": "2px 2px 0px 0px hsl(var(--sketch-border) / 1)",
        "sketch-nav": "2px 2px 0px 0px hsl(var(--sketch-accent-dk) / 1)",
        "sketch-delete": "3px 3px 0px 0px hsl(var(--sketch-danger) / 0.35)",
        "sketch-danger-hover": "2px 2px 0px 0px hsl(var(--sketch-danger) / 0.5)",
      },
      keyframes: {
        "progress-bar": {
          "0%": {
            width: "0"
          },
          "20%": {
            width: "20%"
          },
          "40%": {
            width: "40%"
          },
          "60%": {
            width: "60%"
          },
          "80%": {
            width: "80%"
          },
          "100%": {
            width: "100%"
          },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "progress": "progress-bar 10s linear forwards",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config