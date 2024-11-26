import type { Config } from "tailwindcss";
import formsPlugin from '@tailwindcss/forms';

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      borderRadius: {
        "sexy-name": "11.11px"
      }
    },
  },
  plugins: [
    formsPlugin
  ],
};
export default config;
