import { build, context } from "esbuild";

const options = {
  entryPoints: ["src/client/main.ts"],
  bundle: true,
  sourcemap: true,
  outfile: "public/app.js",
  format: "esm",
  target: "es2022"
};

if (process.argv.includes("--watch")) {
  const ctx = await context(options);
  await ctx.watch();
  console.log("Client bundle watching for changes...");
} else {
  await build(options);
}
