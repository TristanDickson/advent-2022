const fs = require("fs");
var path = require("path");

let inputPath = path.join(__dirname, "input.csv");
let data = fs.readFileSync(inputPath, "utf8");
let list = data.split("\n");

let dict = {
  A: 1,
  B: 2,
  C: 3,
  X: 1,
  Y: 2,
  Z: 3,
};

let games = list.map((x) => {
  return { opp: dict[x[0]], you: dict[x[2]] };
});

let scores = games.map((x) => {
  let score = x.you - x.opp;
  if (score == 0) return 3 + x.you;
  if ([-2, 1].includes(score)) return 6 + x.you;
  else return 0 + x.you;
});

console.log(scores.reduce((acc, curr) => acc + curr, 0));