#!/usr/bin/env node
// One-command entry point for the demos.
//
//   npx github:TristanDickson/advent-2022#demos rope    day 9: the 10-knot rope
//   npx github:TristanDickson/advent-2022#demos climb   day 12: the A* search
//
// Extra flags such as --delay=MS are passed through to the demo.

const { spawnSync } = require("child_process");
const path = require("path");

const [demo, ...flags] = process.argv.slice(2);
const columns = process.stdout.columns ?? 0;

const demos = {
  rope: { dir: "D9/demo", args: ["input.csv"] },
  climb:
    columns > 136
      ? { dir: "D12/demo", args: ["input.csv", "--animate"] }
      : {
          dir: "D12/demo",
          args: ["test.csv", "--animate", "--delay=150"],
          note: "Showing the small example. Widen the terminal past 136 columns for the full map.",
        },
};

const chosen = demos[demo];
if (!chosen) {
  console.log("Usage: advent-2022 <rope|climb> [--delay=MS] [--every=N]");
  process.exit(1);
}

const result = spawnSync(
  process.execPath,
  [path.join(__dirname, chosen.dir, "main.js"), ...chosen.args, ...flags],
  { stdio: "inherit" }
);
if (chosen.note) console.log(`\n${chosen.note}`);
process.exit(result.status ?? 1);
