const fs = require("fs");
var path = require("path");

let inputPath = path.join(__dirname, process.argv[2]);
let data = fs.readFileSync(inputPath, "utf8").split("\n");

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

let boardSize = 1000;

let state = [];
for (let i = 0; i < boardSize; i++) {
  state.push([]);
  for (let j = 0; j < boardSize; j++) {
    state[i].push(" ");
  }
}

let display = [];
for (let i = 0; i < boardSize; i++) {
  display.push([]);
  for (let j = 0; j < boardSize; j++) {
    display[i].push(" ");
  }
}

console.log(display[1][1]);

let vectors = {
  R: { x: 1, y: 0 },
  L: { x: -1, y: 0 },
  U: { x: 0, y: 1 },
  D: { x: 0, y: -1 },
};

let instrs = data.map((x) => x.split(" "));

let h = { x: boardSize / 2 - 1, y: boardSize / 2 - 1 };
let t = { x: boardSize / 2 - 1, y: boardSize / 2 - 1 };

const addV = (v1, v2) => ({ x: v1.x + v2.x, y: v1.y + v2.y });

(async () => {
  for (let i = 0; i < instrs.length; i++) {
    const ins = instrs[i];
    let v = vectors[ins[0]];
    for (let i = 0; i < ins[1]; i++) {
      // console.clear();
      display[h.y][h.x] = state[h.y][h.x];
      display[t.y][t.x] = state[t.y][t.x];
      h = addV(h, v);
      if (Math.abs(h.x - t.x) > 1) {
        t.x += Math.sign(h.x - t.x);
        if (Math.abs(h.y - t.y) > 0) t.y += Math.sign(h.y - t.y);
      }
      if (Math.abs(h.y - t.y) > 1) {
        t.y += Math.sign(h.y - t.y);
        if (Math.abs(h.x - t.x) > 0) t.x += Math.sign(h.x - t.x);
      }

      display[h.y][h.x] = "H";
      display[t.y][t.x] = "T";
      state[t.y][t.x] = "#";
      // console.table(display);
      // await sleep(250);
    }
  }

  console.log(
    state.flat().reduce((acc, curr) => (curr == "#" ? acc + 1 : acc), 0)
  );
})();
