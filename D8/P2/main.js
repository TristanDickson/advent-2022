const fs = require("fs");
var path = require("path");

let inputPath = path.join(__dirname, process.argv[2]);
let data = fs.readFileSync(inputPath, "utf8").split("\n");
let grid = data.map((x) => [...x].map((y) => parseInt(y)));
let trees = grid.map((x, i) =>
  x.map((y, j) => ({ seen: false, height: y, id: i * grid.length + j + 1 }))
);

// console.log(grid);

const calcScore = (trees, x, y) => {
  let tree = trees[y][x];
  // console.log(tree);
  let sight = {
    n: 0,
    e: 0,
    w: 0,
    s: 0,
  };

  // console.log("looking east");
  for (let i = x + 1; i < trees[y].length; i++) {
    sight.e++;
    // console.log(trees[y][i]);
    if (trees[y][i].height >= tree.height) break;
  }

  // console.log("looking west");
  for (let i = x - 1; i >= 0; i--) {
    sight.w++;
    // console.log(trees[y][i]);
    if (trees[y][i].height >= tree.height) break;
  }

  // console.log("looking south");
  for (let j = y + 1; j < trees[x].length; j++) {
    sight.s++;
    // console.log(trees[j][x]);
    if (trees[j][x].height >= tree.height) break;
  }

  // console.log("looking north");
  for (let j = y - 1; j >= 0; j--) {
    sight.n++;
    // console.log(trees[j][x]);
    if (trees[j][x].height >= tree.height) break;
  }

  return Object.values(sight).reduce((acc, curr) => acc * curr, 1);
};

trees = trees.map((x, i) =>
  x.map((y, j) => ({ ...trees[i][j], score: calcScore(trees, j, i) }))
);

console.log(
  trees.flat().reduce((acc, curr) => (curr.score > acc.score ? curr : acc), {
    score: 0,
  })
);
