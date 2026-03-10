/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["system-ui", "ui-sans-serif", "SF Pro Text", "SF Pro Display", "PingFang SC", "sans-serif"]
      }
    }
  },
  plugins: [require("@tailwindcss/typography")]
};

