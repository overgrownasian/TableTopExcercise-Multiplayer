import { spawn } from "node:child_process";

const children = [];
const sharedEnv = { ...process.env };

function run(name, command, args) {
  const child = spawn(command, args, {
    stdio: "inherit",
    shell: true,
    env: sharedEnv
  });
  child.on("exit", (code) => {
    if (code !== 0) {
      console.error(`[${name}] exited with code ${code}`);
    }
  });
  children.push(child);
}

run("client", "node", ["scripts/build-client.mjs", "--watch"]);
run("server-build", "npx", ["tsc", "-p", "tsconfig.server.json", "-w", "--preserveWatchOutput"]);
run("server", "node", ["--watch", "dist/server.js"]);

const shutdown = () => {
  for (const child of children) {
    if (!child.killed) {
      child.kill();
    }
  }
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
