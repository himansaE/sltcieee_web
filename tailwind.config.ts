import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  mode: "jit",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        text: {
          "50": "#edeef7",
          "100": "#dbddf0",
          "200": "#b7bce1",
          "300": "#939ad2",
          "400": "#6f79c3",
          "500": "#4b57b4",
          "600": "#3c4690",
          "700": "#2d346c",
          "800": "#1e2348",
          "900": "#0f1124",
          "950": "#080912",
        },
        background: "hsl(var(--background))",
        primary: {
          "50": "#ecedf8",
          "100": "#d9dcf2",
          "200": "#b3b8e5",
          "300": "#8d95d8",
          "400": "#6771cb",
          "500": "#414ebe",
          "600": "#343e98",
          "700": "#272f72",
          "800": "#1a1f4c",
          "900": "#0d1026",
          "950": "#070813",
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          "50": "#ebedf9",
          "100": "#d8dbf3",
          "200": "#b1b7e7",
          "300": "#8a93db",
          "400": "#6370cf",
          "500": "#3c4cc3",
          "600": "#303d9c",
          "700": "#242d75",
          "800": "#181e4e",
          "900": "#0c0f27",
          "950": "#060814",
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        accent: {
          "50": "#ebecfa",
          "100": "#d7daf4",
          "200": "#afb5e9",
          "300": "#8790de",
          "400": "#5f6ad3",
          "500": "#3745c8",
          "600": "#2c37a0",
          "700": "#212a78",
          "800": "#161c50",
          "900": "#0b0e28",
          "950": "#050714",
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      fontFamily: {
        primary: ["var(--font-wix-madefor-display)"],
        secondary: ["var(--font-poppins)"],
      },
      // borderRadius: {
      // 	lg: 'var(--radius)',
      // 	md: 'calc(var(--radius) - 2px)',
      // 	sm: 'calc(var(--radius) - 4px)'
      // }
    },
  },
  //   plugins: [require("tailwindcss-animate")],
};
export default config;

console.log("Loading Tailwind Config");
