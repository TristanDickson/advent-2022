const fs = require("fs");
var path = require("path");

let inputPath = path.join(__dirname, process.argv[2]);
let data = fs.readFileSync(inputPath, "utf8");
let list = data.split("\n");

let calcPrio = (x) => {
  if (x === x.toUpperCase()) {
    return x.charCodeAt(0) - 38;
  }
  return x.charCodeAt(0) - 96;
};

let items = list.map((x) => {
  return {
    0: [...x.slice(0, x.length / 2)],
    1: [...x.slice(x.length / 2, x.length)],
  };
});

items.forEach(
  (x) =>
    (x.intersection = x[0]
      .filter((y) => x[1].includes(y))
      .reduce((acc, curr) => (acc.includes(curr) ? acc : [curr, ...acc]), []))
);

items.forEach((x) => (x.priority = calcPrio(x.intersection[0])));

console.log(items.reduce((acc, curr) => acc + curr.priority, 0));
