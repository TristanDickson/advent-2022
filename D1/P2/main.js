const fs = require("fs");
var path = require("path");

let inputPath = path.join(__dirname, "input.csv");
let data = fs.readFileSync(inputPath, "utf8");
let list = data.split("\n");
let numList = list.map(x => parseInt(x));
let increased = 0;
for (let i = 1; i < numList.length - 2; i++) {
  prevSum = numList[i - 1] + numList[i] + numList[i + 1];
  sum = numList[i] + numList[i + 1] + numList[i + 2];
  console.log(`prevSum = ${prevSum}`)
  console.log(`sum = ${sum}`)
  if (sum > prevSum) increased++;
}
console.log(increased);
