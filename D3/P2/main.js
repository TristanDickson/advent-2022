const fs = require("fs");
var path = require("path");

let inputPath = path.join(__dirname, process.argv[2]);
let data = fs.readFileSync(inputPath, "utf8");
let list = data.split("\n").map((x) => [...x]);

let calcPrio = (x) => {
  if (x === x.toUpperCase()) {
    return x.charCodeAt(0) - 38;
  }
  return x.charCodeAt(0) - 96;
};

let groups = [];
for (let i = 0; i < list.length / 3; i++) {
  groups[i] = [list[i * 3], list[i * 3 + 1], list[i * 3 + 2]];
}

let letters = groups
  .map((g) =>
    g[0]
      .filter((y) => g[1].includes(y))
      .filter((z) => g[2].includes(z))
      .reduce((acc, curr) => (acc.includes(curr) ? acc : [curr, ...acc]), [])
      .map((x) => calcPrio(x))
  )
  .flat();

console.log(letters.reduce((acc, curr) => acc + curr, 0));
