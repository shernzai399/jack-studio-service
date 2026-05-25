import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}", "./lib/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        espresso: "#231713",
        coffee: "#3a2720",
        leather: "#7a4b32",
        saddle: "#9c6a43",
        gold: "#c9a45c",
        cream: "#fff8eb",
        warm: "#f2e3cc",
        ink: "#15110f"
      },
      boxShadow: {
        soft: "0 18px 45px rgba(35, 23, 19, 0.14)"
      }
    }
  },
  plugins: []
};

export default config;
