const fs = require("fs");
var path = require("path");

let inputPath = path.join(__dirname, process.argv[2]);
let data = fs.readFileSync(inputPath, "utf8").split("\n\n");

let diagram = data[0].split("\n");
let crates = diagram.slice(0, diagram.length - 1);
let key = diagram[0];
let instructions = data[1].split("\n").map((x) => {
  let words = x.split(" ");
  return {
    num: parseInt(words[1]),
    src: parseInt(words[3]),
    dst: parseInt(words[5]),
  };
});

let totStacks = (key.length + 1) / 4;
let stacks = [];
for (var i = 0; i < totStacks; i++) {
  stacks.push([]);
}

for (let j = crates.length - 1; j >= 0; j--) {
  for (let i = 1; i <= totStacks; i++) {
    let strIndex = i * 4 - 3;
    let letter = crates[j][strIndex];
    if (letter != " ") stacks[i - 1].push(letter);
  }
}

console.log(instructions);

for (const ins of instructions) {
  for (let i = 0; i < ins.num; i++) {
    let crate = stacks[ins.src - 1].pop();
    stacks[ins.dst - 1].push(crate);
  }
}

console.log(stacks.reduce((acc, curr) => acc + curr[curr.length - 1], ""));
