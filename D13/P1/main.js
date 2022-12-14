const fs = require("fs");
var path = require("path");

let inputPath = path.join(__dirname, process.argv[2]);
let data = fs.readFileSync(inputPath, "utf8").split("\n\n");

let packets = data.map((x) => x.split("\n").map((x) => JSON.parse(x)));

let convert = (el) => {
  return typeof el == "number" ? [el] : el;
};

let checkOrder = (p1, p2) => {
  console.log(`${JSON.stringify(p1)} || ${JSON.stringify(p2)}`);
  console.log(typeof p1, typeof p2);
  if (typeof p1 == "number" && typeof p2 == "number") {
    if (p1 < p2) return true;
    if (p1 > p2) return false;
    return "eq";
  } else if (typeof p1 == "number" || typeof p2 == "number") {
    return checkOrder(convert(p1), convert(p2));
  } else {
    const I = p1.length > p2.length ? p1.length : p2.length;
    for (let i = 0; i < I; i++) {
      if (i > p1.length - 1) return true;
      if (i > p2.length - 1) return false;
      let check = checkOrder(p1[i], p2[i]);
      if (check !== "eq") {
        console.log(check);
        return check;
      }
    }
  }
  return "eq";
};

let indicies = [];
packets.forEach((pair, i) => {
  console.log(`\n${i + 1}`);
  check = checkOrder(pair[0], pair[1]);
  if (check == true || check == "eq") indicies.push(i + 1);
  console.log(check);
});
console.log(indicies);
console.log(indicies.reduce((arr, curr) => arr + curr, 0));
