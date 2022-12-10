const fs = require("fs");
var path = require("path");

let inputPath = path.join(__dirname, process.argv[2]);
let data = fs.readFileSync(inputPath, "utf8").split("\n");

let instrs = data.map((x) => {
  let split = x.split(" ");
  return { op: split[0], val: split.length > 1 ? parseInt(split[1]) : null };
});

let X = 1;
let curCycle = 1;
let sigSum = 0;

let checkSig = () => {
  if ((curCycle + 20) % 40 == 0) {
    let sig = curCycle * X;
    console.log(`${curCycle}, ${X}, ${sig}`);
    sigSum += sig;
  }
};

for (ins of instrs) {
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
}
console.log(curCycle);
console.log(sigSum);
