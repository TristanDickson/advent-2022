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

let camera = { x: boardSize / 2, y: boardSize / 2 };

let display = [];
for (let i = 0; i < boardSize; i++) {
  display.push([]);
  for (let j = 0; j < boardSize; j++) {
    display[i].push(" ");
  }
}

let vectors = {
  R: { x: 1, y: 0 },
  L: { x: -1, y: 0 },
  U: { x: 0, y: 1 },
  D: { x: 0, y: -1 },
};

let instrs = data.map((x) => x.split(" "));

let rope = [];
for (let i = 0; i < 10; i++) {
  rope.push({ x: boardSize / 2 - 1, y: boardSize / 2 - 1 });
}

const addV = (v1, v2) => ({ x: v1.x + v2.x, y: v1.y + v2.y });

const calcNewPosition = (h, t) => {
  if (Math.abs(h.x - t.x) > 1) {
    t.x += Math.sign(h.x - t.x);
    if (Math.abs(h.y - t.y) > 0) t.y += Math.sign(h.y - t.y);
  }
  if (Math.abs(h.y - t.y) > 1) {
    t.y += Math.sign(h.y - t.y);
    if (Math.abs(h.x - t.x) > 0) t.x += Math.sign(h.x - t.x);
  }
};

const updateCamera = (h, c) => {
  if (h.x > c.x + 8) c.x++;
  if (h.x < c.x - 8) c.x--;
  if (h.y > c.y + 8) c.y++;
  if (h.y < c.y - 8) c.y--;
};

(async () => {
  for (let i = 0; i < instrs.length; i++) {
    const ins = instrs[i];
    let v = vectors[ins[0]];

    for (let i = 0; i < ins[1]; i++) {
      console.clear();

      for (let i = 0; i < rope.length; i++) {
        let section = rope[i];
        display[section.y][section.x] = state[section.y][section.x];
      }

      rope[0] = addV(rope[0], v);
      for (let i = 1; i < rope.length; i++) {
        calcNewPosition(rope[i - 1], rope[i]);
      }

      for (let i = rope.length - 1; i >= 0; i--) {
        let section = rope[i];
        if (i == rope.length - 1) state[section.y][section.x] = "#";
        display[section.y][section.x] = i;
      }

      updateCamera(rope[0], camera);
      console.table(
        display
          .slice(camera.y - 10, camera.y + 10)
          .map((x) => x.slice(camera.x - 10, camera.x + 10))
      );
      await sleep(100);
    }
  }

  console.log(
    state.flat().reduce((acc, curr) => (curr == "#" ? acc + 1 : acc), 0)
  );
})();
