const fs = require("fs");
var path = require("path");
const { exit } = require("process");

let inputPath = path.join(__dirname, process.argv[2]);
let data = fs.readFileSync(inputPath, "utf8").split("\n");

let setNested = (object, path, key, value) => {
  if (path.length > 1) {
    setNested(object[path[0]], path.slice(1, path.length), key, value);
  } else {
    object[path][key] = value;
  }
};

let calcSizes = (item, smallFoldersTotal) => {
  if (typeof item == "object") {
    item.disksize = 0;
    Object.keys(item)
      .filter((x) => x != "disksize")
      .forEach(
        (key) => (item.disksize += calcSizes(item[key], smallFoldersTotal))
      );
    if (item.disksize < 100000) smallFoldersTotal.size += item.disksize;
    return item.disksize;
  } else {
    return item;
  }
};

let parseCommand = (command) => {
  if (command[0] == "$") {
    if (command[1] == "cd") {
      if (command[2] == "..") {
        pwd.pop();
      } else {
        pwd.push(command[2]);
      }
    }
  } else {
    if (command[0] == "dir") {
      setNested(tree, pwd, command[1], {});
    } else {
      setNested(tree, pwd, command[1], parseInt(command[0]));
    }
  }
  // console.log(`\ncommand: ${command}`);
  // console.log(`pwd: ${pwd}`);
  // console.log(tree);
};

let commands = data.map((x) => x.split(" "));
let pwd = [];
let tree = { "/": {} };

commands.forEach((x) => parseCommand(x));

let smallFoldersTotal = { size: 0 };
calcSizes(tree, smallFoldersTotal);
console.log(smallFoldersTotal);
// let json = JSON.stringify(tree, null, 2);
// console.log(json);
