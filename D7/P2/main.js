const fs = require("fs");
var path = require("path");

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
    item.size = 0;
    Object.keys(item)
      .filter((x) => x != "size")
      .forEach((key) => (item.size += calcSizes(item[key], smallFoldersTotal)));
    if (item.size < 100000) smallFoldersTotal.size += item.size;
    return item.size;
  } else {
    return item;
  }
};

let findFileToDelete = (item, spaceNeeded, fileToDelete) => {
  if (typeof item == "object") {
    Object.values(item).forEach((x) =>
      findFileToDelete(x, spaceNeeded, fileToDelete)
    );
    if (item.size > spaceNeeded && fileToDelete.size > item.size)
      fileToDelete.size = item.size;
    console.log(fileToDelete.size);
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
let spaceLeft = 70000000 - tree["/"].size;
let spaceNeeded = 30000000 - spaceLeft;
let fileToDelete = { size: 70000000 };
console.log(spaceNeeded);
findFileToDelete(tree, spaceNeeded, fileToDelete);
// let json = JSON.stringify(tree, null, 2);
// console.log(json);
