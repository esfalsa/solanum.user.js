import typescript from "@rollup/plugin-typescript";
import userscript from "rollup-plugin-userscript";
import path from "node:path";

/** @type {import('rollup').RollupOptions} */
const config = {
  input: "src/index.ts",
  output: {
    format: "iife",
    file: "dist/solanum.user.js",
  },
  plugins: [typescript(), userscript(path.resolve("src/meta.ts"))],
};

export default config;
