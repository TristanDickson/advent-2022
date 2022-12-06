const fs = require("fs");
var path = require("path");

let inputPath = path.join(__dirname, "input.csv");
let data = fs.readFileSync(inputPath, "utf8");
let list = data.split("\n\n");
let elves = list.map((x) => x.split("\n").map((x) => parseInt(x)));
let elvesTotals = elves.map((x) => x.reduce((acc, curr) => acc + curr, 0));
let largestElves = elvesTotals.sort((x, y) => y - x);
console.log(largestElves[0] + largestElves[1] + largestElves[2]);
