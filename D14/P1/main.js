const fs = require("fs");
var path = require("path");

let inputPath = path.join(__dirname, process.argv[2]);
let data = fs.readFileSync(inputPath, "utf8").split("\n");
let paths = data.map((x) =>
  x.split(" -> ").map((t) => ({
    x: parseInt(t.split(",")[0]),
    y: parseInt(t.split(",")[1]),
  }))
);
// console.log(paths);

const drawGrid = (grid) => {
  grid.slice(0, 13).forEach((x) => console.log(x.slice(488, 514).join('')));
};

const grid = [];
for (let i = 0; i < 1000; i++) {
  grid.push([]);
  for (let j = 0; j < 1000; j++) {
    grid[i].push(".");
  }
}

const moveSand = (s, g) => {
  if (g[s.y + 1][s.x] == ".") {
    s.y++;
    return true;
  } else if (g[s.y + 1][s.x - 1] == ".") {
    s.y++;
    s.x--;
    return true;
  } else if (g[s.y + 1][s.x + 1] == ".") {
    s.y++;
    s.x++;
    return true;
  }

  return false;
};

const addPath = (p1, p2) => {
  if (p1.x == p2.x) {
    if (p1.y > p2.y) [p1, p2] = [p2, p1];
    for (let j = p1.x; j <= p2.x; j++) {
      grid[j][p1.x] = "#";
    }
  } else {
    if (p1.x > p2.x) [p1, p2] = [p2, p1];
    for (let i = p1.x; i <= p2.x; i++) {
      grid[p1.y][i] = "#";
    }
  }
  console.log(p1, p2);
  for (let i = p1.x; i >= p2.x; i--) {
    for (let j = p1.y; j <= p2.y; j++) {
      grid[j][i] = "#";
    }
  }
};

const addSand = (s, grid) => {
  grid[s.y][s.x] = "o";
};

for (const path of paths) {
  for (let i = 0; i < path.length - 1; i++) {
    addPath(path[i], path[i + 1]);
  }
}

let lowest = paths
  .flat()
  .flat()
  .reduce((acc, curr) => (curr.y > acc ? curr.y : acc), 0);
console.log(lowest);

addPath(paths[0][0], paths[0][1]);

let i = 0;
while (true) {
  let sand = { x: 500, y: 0 };
  i++;
  while (moveSand(sand, grid) && sand.y < lowest + 1) {
    // console.log(sand);
  }
  if (sand.y == 0) break;
  // console.log(sand, i);
  addSand(sand, grid);
}

drawGrid(grid);
console.log(i);
