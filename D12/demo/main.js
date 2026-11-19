// Day 12 demo: A* over the height map, with an optional live view of the search.
//
//   node main.js [file]                 print part 1 and part 2
//   node main.js [file] --animate       watch the part 1 search, then the path
//     --delay=MS     time per frame (default 16)
//     --every=N      search steps per frame (default 1)
//
// The full input is 136 columns wide, so widen the terminal or shrink the font.

const fs = require("fs");
const path = require("path");
const timers = require("timers/promises");

const args = process.argv.slice(2);
const option = (name, fallback) => {
  const arg = args.find((x) => x.startsWith(`--${name}=`));
  return arg ? parseInt(arg.split("=")[1]) : fallback;
};
const inputFile = args.find((x) => !x.startsWith("--")) ?? "input.csv";
const animate = args.includes("--animate");

const getHeight = (letter) => {
  if (letter == "S") return 0;
  if (letter == "E") return 25;
  return letter.charCodeAt(0) - 97;
};

// Arrow for the direction of travel from `from` into `to`.
const getIcon = (to, from) =>
  ["↑", "←", "", "→", "↓"][to.x - from.x + (to.y - from.y) * 2 + 2];

const calcDistance = (tile1, tile2) =>
  Math.abs(tile1.x - tile2.x) + Math.abs(tile1.y - tile2.y);

const data = fs
  .readFileSync(path.join(__dirname, inputFile), "utf8")
  .split("\n")
  .map((line) => line.trim())
  .filter((line) => line.length > 0);

let start;
let end;
const tiles = data.map((line, y) =>
  [...line].map((letter, x) => {
    const tile = { x, y, letter, height: getHeight(letter) };
    if (letter == "S") start = tile;
    if (letter == "E") end = tile;
    return tile;
  })
);

const getAdjacent = (tile) =>
  [[0, -1], [-1, 0], [1, 0], [0, 1]]
    .map(([dx, dy]) => tiles[tile.y + dy]?.[tile.x + dx])
    .filter((next) => next && next.height - tile.height < 2);

// A* from start to end. Returns the path (end first, start excluded), or null.
const findPath = async (start, end, onStep) => {
  tiles.flat().forEach((tile) => {
    tile.fromStart = Infinity;
    tile.previous = null;
  });
  start.fromStart = 0;

  const score = (tile) => tile.fromStart + calcDistance(tile, end);
  const openTiles = new Set([start]);
  const closedTiles = new Set();

  while (openTiles.size > 0) {
    let currentTile;
    for (const tile of openTiles) {
      if (!currentTile || score(tile) < score(currentTile)) currentTile = tile;
    }

    if (currentTile === end) {
      const path = [];
      for (let tile = end; tile !== start; tile = tile.previous) path.push(tile);
      return path;
    }

    openTiles.delete(currentTile);
    closedTiles.add(currentTile);

    for (const tile of getAdjacent(currentTile)) {
      if (closedTiles.has(tile)) continue;
      const fromStart = currentTile.fromStart + 1;
      if (fromStart < tile.fromStart) {
        tile.fromStart = fromStart;
        tile.previous = currentTile;
      }
      openTiles.add(tile);
    }

    if (onStep) await onStep(openTiles, closedTiles);
  }
  return null;
};

const shade = (height) => `\x1b[38;5;${238 + Math.round((height * 17) / 25)}m`;

// pathIcons maps each tile on the path to the arrow pointing at the next tile.
const render = (openTiles, closedTiles, pathIcons = new Map()) => {
  let out = "\x1b[H";
  for (const row of tiles) {
    for (const tile of row) {
      if (tile === start || tile === end) out += `\x1b[1;32m${tile.letter}\x1b[0m`;
      else if (pathIcons.has(tile)) out += `\x1b[1;31m${pathIcons.get(tile)}\x1b[0m`;
      else if (openTiles.has(tile)) out += `\x1b[33m▮`;
      else if (closedTiles.has(tile)) out += `\x1b[36m${tile.letter}`;
      else out += shade(tile.height) + tile.letter;
    }
    out += "\x1b[0m\n";
  }
  process.stdout.write(out);
};

const animatePart1 = async () => {
  const delay = option("delay", 16);
  const every = option("every", 1);
  const width = tiles[0].length;
  if (process.stdout.columns && process.stdout.columns < width) {
    console.log(`Terminal is ${process.stdout.columns} columns, map is ${width}. Widen it and rerun.`);
    return;
  }

  const restoreCursor = () => process.stdout.write("\x1b[?25h");
  process.on("SIGINT", () => {
    restoreCursor();
    process.exit(130);
  });
  process.stdout.write("\x1b[2J\x1b[?25l");

  // A fixed-rate tick, so drawing time doesn't change the speed.
  const ticks = timers.setInterval(delay)[Symbol.asyncIterator]();
  let steps = 0;
  let open, closed;
  const path = await findPath(start, end, async (openTiles, closedTiles) => {
    open = openTiles;
    closed = closedTiles;
    if (++steps % every == 0) {
      render(openTiles, closedTiles);
      await ticks.next();
    }
  });
  await ticks.return();

  render(open, closed, new Map(path.map((tile) => [tile.previous, getIcon(tile, tile.previous)])));
  restoreCursor();
  console.log(`\nPart 1: ${path.length} steps (${steps} tiles explored)`);
};

const solve = async () => {
  const part1 = (await findPath(start, end)).length;

  // Every b sits in column 1 with an a directly to its left, and any route up
  // from an a has to cross a b. So the best a is always in column 0, and only
  // those starts need searching.
  let part2 = Infinity;
  for (const row of tiles) {
    const path = await findPath(row[0], end);
    if (path) part2 = Math.min(part2, path.length);
  }

  console.log(`Part 1: ${part1}`);
  console.log(`Part 2: ${part2}`);
};

animate ? animatePart1() : solve();
