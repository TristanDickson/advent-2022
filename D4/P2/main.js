const fs = require("fs");
var path = require("path");

let inputPath = path.join(__dirname, process.argv[2]);
let data = fs.readFileSync(inputPath, "utf8");
let list = data.split("\n");

let lines = list.map((x) => {
  let assigns = x.split(",");
  let e1 = assigns[0].split("-");
  let e2 = assigns[1].split("-");
  return {
    e1: { s1: parseInt(e1[0]), s2: parseInt(e1[1]) },
    e2: { s1: parseInt(e2[0]), s2: parseInt(e2[1]) },
  };
});

console.log(lines);

let overlaps = lines.map((x) =>
  (x.e1.s2 >= x.e2.s1 && x.e1.s1 <= x.e2.s1) ||
  (x.e2.s2 >= x.e1.s1 && x.e2.s1 <= x.e1.s1)
    ? true
    : false
);

console.log(overlaps.reduce((acc, curr) => (curr ? acc + 1 : acc), 0));
