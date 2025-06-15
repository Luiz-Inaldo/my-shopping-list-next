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
      screens: {
        "2xsm": "375px",
        "xsm": "425px",
        "2xl": "1400px",
      },
      height: {
        "screen-dvh":  "100dvh",
        "screen-svh":  "100svh",
      },
      minHeight: {
        "screen-dvh":  "100dvh",
        "screen-svh":  "100svh",
      },
      maxHeight: {
        "screen-dvh":   "100dvh",
        "screen-svh":   "100svh",
      },
      colors: {
        border: "hsl(var(--border))",
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
        "app-primary": "var(--app-primary)",
        "app-container": "var(--app-container)",
        "primary-dark": "#212529",
        "secondary-dark": "#343a40",
        "dark-button-color": "#0466c8",
        "primary-blue": "#A0CFF7",
        "secondary-blue": "#0066CC", 
        title: "var(--title)",
        subtitle: "var(--subtitle)",
        paragraph: "var(--paragraph)",
        link: "var(--link)"
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
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