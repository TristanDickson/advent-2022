const fs = require("fs");
var path = require("path");

let inputPath = path.join(__dirname, process.argv[2]);
let data = fs.readFileSync(inputPath, "utf8").split("\n\n");
let monkeys = data
  .map((x) => x.split("\n"))
  .map((x) => ({
    id: x[0].split(" ")[1][0],
    items: x[1]
      .split(" ")
      .slice(4)
      .map((x) => BigInt(parseInt(x))),
    op: eval(`old => ${x[2].substring(19).replace(/(\d{1,})/, "BigInt($1)")}`),
    next: (w) =>
      w % BigInt(parseInt(x[3].split(" ")[5])) == 0
        ? parseInt(x[4].split(" ")[9])
        : parseInt(x[5].split(" ")[9]),
    divisor: BigInt(parseInt(x[3].split(" ")[5])),
    activity: 0,
  }));

let divisor = BigInt(
  monkeys.reduce((arr, curr) => arr * curr.divisor, BigInt(1))
);
console.log(divisor);

for (let i = 0; i < 10000; i++) {
  for (m of monkeys) {
    while (m.items.length > 0) {
      let i = m.items[0];
      i = m.op(i) % divisor;
      m.activity++;
      monkeys[m.next(i)].items.push(i);
      m.items.shift();
    }
  }
}

console.log(monkeys);

let sorted = monkeys.sort((m1, m2) => m2.activity - m1.activity);
console.log(sorted[0].activity * sorted[1].activity);
