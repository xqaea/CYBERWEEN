import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: { extend: { colors: { void: "#080810", panel: "#11111d", violet: "#a78bfa", ember: "#ff7a3d", toxic: "#a3e635" } } },
  plugins: []
};
export default config;
