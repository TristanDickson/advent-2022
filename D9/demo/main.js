// Day 9 demo: a 10-knot rope following its head, drawn live in the terminal.
//
//   node main.js [file]              animate, with both answers shown from the start
//   node main.js [file] --quiet      just print part 1 and part 2
//     --delay=MS     time per frame (default 50)
//     --every=N      moves per frame (default 1)
//
// At the defaults the full input takes about 10 minutes; Ctrl-C stops it at any point.
// test2.csv is the larger worked example from the puzzle and makes a good first run.

const fs = require("fs");
const path = require("path");
const timers = require("timers/promises");

const args = process.argv.slice(2);
const option = (name, fallback) => {
  const arg = args.find((x) => x.startsWith(`--${name}=`));
  return arg ? parseInt(arg.split("=")[1]) : fallback;
};
const inputFile = args.find((x) => !x.startsWith("--")) ?? "input.csv";
const quiet = args.includes("--quiet");

const vectors = {
  R: { x: 1, y: 0 },
  L: { x: -1, y: 0 },
  U: { x: 0, y: 1 },
  D: { x: 0, y: -1 },
};

const instrs = fs
  .readFileSync(path.join(__dirname, inputFile), "utf8")
  .split("\n")
  .filter((line) => line.trim().length > 0)
  .map((line) => line.split(" "))
  .map(([dir, dist]) => ({ v: vectors[dir], dist: parseInt(dist) }));

const calcNewPosition = (h, t) => {
  if (Math.abs(h.x - t.x) > 1) {
    t.x += Math.sign(h.x - t.x);
    if (Math.abs(h.y - t.y) > 0) t.y += Math.sign(h.y - t.y);
  }
  if (Math.abs(h.y - t.y) > 1) {
    t.y += Math.sign(h.y - t.y);
    if (Math.abs(h.x - t.x) > 0) t.x += Math.sign(h.x - t.x);
  }
};

// Moves the rope through every instruction and returns how many cells the tail visited.
const simulate = async (knots, onMove) => {
  const rope = Array.from({ length: knots }, () => ({ x: 0, y: 0 }));
  const visited = new Set(["0,0"]);
  for (const ins of instrs) {
    for (let i = 0; i < ins.dist; i++) {
      rope[0].x += ins.v.x;
      rope[0].y += ins.v.y;
      for (let k = 1; k < rope.length; k++) calcNewPosition(rope[k - 1], rope[k]);
      const tail = rope[rope.length - 1];
      visited.add(`${tail.x},${tail.y}`);
      if (onMove) await onMove(rope, visited);
    }
  }
  return visited.size;
};

// The camera only moves when the head gets within `margin` cells of the edge.
const updateCamera = (h, c, width, height, margin) => {
  const mx = Math.min(margin, Math.floor(width / 2) - 1);
  const my = Math.min(margin, Math.floor(height / 2) - 1);
  if (h.x > c.x + width / 2 - mx) c.x++;
  if (h.x < c.x - width / 2 + mx) c.x--;
  if (h.y > c.y + height / 2 - my) c.y++;
  if (h.y < c.y - height / 2 + my) c.y--;
};

const render = (rope, visited, camera, width, height, status) => {
  const knotAt = new Map();
  for (let k = rope.length - 1; k >= 0; k--) knotAt.set(`${rope[k].x},${rope[k].y}`, k);

  const left = camera.x - Math.floor(width / 2);
  const top = camera.y + Math.floor(height / 2);
  let out = "\x1b[H";
  for (let y = top; y > top - height; y--) {
    for (let x = left; x < left + width; x++) {
      const key = `${x},${y}`;
      if (knotAt.has(key)) {
        const k = knotAt.get(key);
        out += k == 0 ? "\x1b[1;31mH" : `\x1b[1;33m${k}`;
      } else if (visited.has(key)) out += "\x1b[38;5;30m#";
      else if (x == 0 && y == 0) out += "\x1b[38;5;244ms";
      else out += "\x1b[38;5;236m·";
    }
    out += "\x1b[0m\n";
  }
  out += `${status}   tail has visited ${visited.size} cells\x1b[K`;
  process.stdout.write(out);
};

const animate = async (answers) => {
  const delay = option("delay", 50);
  const every = option("every", 1);
  const totalMoves = instrs.reduce((acc, ins) => acc + ins.dist, 0);
  const width = Math.min(process.stdout.columns || 80, 120);
  const height = Math.min((process.stdout.rows || 24) - 2, 40);
  const camera = { x: 0, y: 0 };

  const restoreCursor = () => process.stdout.write("\x1b[?25h");
  process.on("SIGINT", () => {
    restoreCursor();
    process.exit(130);
  });
  process.stdout.write("\x1b[2J\x1b[?25l");

  // A fixed-rate tick, so drawing time doesn't change the speed.
  const ticks = timers.setInterval(delay)[Symbol.asyncIterator]();
  const status = () => `${answers}   move ${moves} of ${totalMoves}`;
  let moves = 0;
  let last;
  await simulate(10, async (rope, visited) => {
    updateCamera(rope[0], camera, width, height, 8);
    last = [rope, visited];
    if (++moves % every == 0) {
      render(rope, visited, camera, width, height, status());
      await ticks.next();
    }
  });
  await ticks.return();
  render(...last, camera, width, height, status());
  restoreCursor();
  console.log();
};

const main = async () => {
  const answers = `Part 1: ${await simulate(2)}   Part 2: ${await simulate(10)}`;
  if (quiet) console.log(answers);
  else await animate(answers);
};

main();
