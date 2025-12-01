import esbuild from "esbuild";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { readFileSync } from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import("esbuild").BuildOptions} */
const baseConfig = {
  entryPoints: ["src/main.ts"],
  bundle: true,
  format: "cjs",
  platform: "browser",
  treeShaking: true,
  external: ["obsidian"],
  target: ["es2020"],
  logLevel: "info",
  outfile: "main.js",
};

const args = process.argv.slice(2);
const watch = args.includes("--watch");

if (watch) {
  esbuild
    .context(baseConfig)
    .then((ctx) => ctx.watch())
    .then(() => console.log("Watching for changes..."))
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
} else {
  esbuild
    .build(baseConfig)
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}
