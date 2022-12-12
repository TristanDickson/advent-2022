const fs = require("fs");
var path = require("path");

const getIcon = (t1, t2) => {
  iconDict = ["↑", "←", "", "→", "↓"];
  return iconDict[t1.x - t2.x + (t1.y - t2.y) * 2 + 2];
};

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const getHeight = (x) => {
  if (x == "S") {
    return 0;
  }
  if (x == "E") {
    return 25;
  }
  return x.charCodeAt(0) - 97;
};

const getAdjacent = (tiles, tile) => {
  return tiles.filter(
    (_tile) =>
      Math.abs(tile.x - _tile.x) + Math.abs(tile.y - _tile.y) < 2 &&
      _tile.height - tile.height < 2
  );
};

const calcDistance = (tile1, tile2) => {
  return Math.abs(tile1.x - tile2.x) + Math.abs(tile1.y - tile2.y);
};

const findPath = (start, end, tileList) => {
  const openTiles = [start];
  const closedTiles = [];
  let pathFound = false;

  start.toGoal = calcDistance(start, end);
  start.fromStart = 0;

  while (!pathFound && openTiles.length > 0) {
    openTiles.sort(
      (tile1, tile2) =>
        tile1.toGoal + tile1.fromStart - (tile2.toGoal + tile2.fromStart)
    );

    const currentTile = openTiles[0];
    // console.clear();
    // displayTiles(tiles, (x) => {
    //   if (openTiles.includes(x)) return "▮";
    //   if (closedTiles.includes(x)) return "▯";
    //   return x.letter;
    // });
    // console.log(openTiles.map((x) => [x.x, x.y, x.toGoal, x.fromStart]));
    // await sleep(10);

    if (currentTile === end) {
      pathFound = true;
      break;
    }
    openTiles.splice(openTiles.indexOf(currentTile), 1);
    closedTiles.push(currentTile);

    getAdjacent(tileList, currentTile).forEach((tile) => {
      if (!closedTiles.includes(tile)) {
        tile.toGoal = calcDistance(tile, end);
        const fromStart = currentTile.fromStart + 1;
        if (!tile.fromStart || fromStart < tile.fromStart) {
          tile.previous = currentTile;
          tile.fromStart = fromStart;
        }
        if (!openTiles.includes(tile)) {
          openTiles.push(tile);
        }
      }
    });
  }

  const path = [];
  if (pathFound) {
    let currentTile = end;
    while (start != currentTile) {
      path.push(currentTile);
      currentTile = currentTile.previous;
    }
  }
  // displayTiles(tiles, (x) => {
  //   if (path.includes(x)) return getIcon(x.previous, x);
  //   return ".";
  // });
  // console.log(path.length);
  return path;
};

const displayTiles = (tiles, highlight) => {
  tiles.forEach((line, j) => {
    console.log(line.map((tile) => highlight(tile)).join(""));
  });
};

let inputPath = path.join(__dirname, process.argv[2]);
let data = fs.readFileSync(inputPath, "utf8").split("\n");

let start;
let end;

let tiles = data.map((x, i) =>
  x.split("").map((x, j) => {
    let tile = {
      id: i + x.length * j,
      x: j,
      y: i,
      height: getHeight(x),
      letter: x,
    };
    if (x == "S") {
      start = tile;
    }
    if (x == "E") {
      end = tile;
    }
    return tile;
  })
);

let tileList = tiles.flat().filter((x) => x != start);
// console.log(tileList);

let grid = tiles.map((x, i) => x.map((x, j) => x.height));
// console.log(displayTiles2(tiles));

let min = 500;
console.log(tiles.length);
tiles.forEach((line, i) => {
  console.log(i);
  let pl = findPath(line[0], end, tileList).length;
  console.log(pl);
  min = pl < min ? pl : min;
});
console.log(min);
