const fs = require("fs");
var path = require("path");

let inputPath = path.join(__dirname, process.argv[2]);
let data = fs.readFileSync(inputPath, "utf8").split("\n");

let instrs = data.map((x) => {
  let split = x.split(" ");
  return { op: split[0], val: split.length > 1 ? parseInt(split[1]) : null };
});

let X = 1;
let curCycle = 0;
let screen = [];
let buffer = "";

let checkSig = () => {
  let pixel = curCycle % 40;
  X - 2 < pixel && pixel < X + 2 ? (buffer += "#") : (buffer += " ");
  if ((curCycle + 1) % 40 == 0) {
    screen.push(buffer);
    buffer = "";
  }
};

instrs.forEach((ins) => {
  if (ins.op == "addx") {
    checkSig();
    curCycle += 1;
    checkSig();
    curCycle += 1;
    X += ins.val;
  } else {
    checkSig();
    curCycle += 1;
  }
});

console.log(screen);
