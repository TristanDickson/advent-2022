const fs = require("fs");
var path = require("path");

let inputPath = path.join(__dirname, "input.csv");
let data = fs.readFileSync(inputPath, "utf8");
let list = data.split("\n");

let dict = {
  A: 0,
  B: 1,
  C: 2,
  X: 2,
  Y: 0,
  Z: 1,
};

let games = list.map((x) => {
  return { opp: dict[x[0]] + 1, you: ((dict[x[0]] + dict[x[2]]) % 3) + 1 };
});

console.log(games);

let scores = games.map((x) => {
  let score = x.you - x.opp;
  if (score == 0) return 3 + x.you;
  if ([-2, 1].includes(score)) return 6 + x.you;
  else return 0 + x.you;
});

console.log(scores.reduce((acc, curr) => acc + curr, 0));
