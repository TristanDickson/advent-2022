const fs = require("fs");
var path = require("path");

let inputPath = path.join(__dirname, process.argv[2]);
let data = fs.readFileSync(inputPath, "utf8").split("\n");
let grid = data.map((x) => [...x].map((y) => parseInt(y)));
let trees = grid.map((x, i) =>
  x.map((y, j) => ({ seen: false, height: y, id: i * grid.length + j + 1 }))
);

let transpose = (array) => {
  let tArray = [];
  for (let i = 0; i < array.length; i++) {
    tArray.push([]);
    for (let j = 0; j < array[i].length; j++) {
      tArray[i].push(array[j][i]);
    }
  }
  return tArray;
};

const setSeen = (line) => {
  line[0].seen = true;
  let highest = line[0].height;
  for (let i = 1; i < line.length; i++) {
    let tree = line[i];
    if (tree.height > highest) {
      tree.seen = true;
      highest = tree.height;
    }
  }
};

trees.forEach((line) => {
  setSeen(line);
  line.reverse();
  setSeen(line);
  line.reverse();
});

transpose(trees).forEach((line) => {
  setSeen(line);
  line.reverse();
  setSeen(line);
  line.reverse();
});

console.log(trees.flat().reduce((acc, curr) => (curr.seen ? acc + 1 : acc), 0));
