const fs = require("fs");
var path = require("path");

let inputPath = path.join(__dirname, process.argv[2]);
let data = fs.readFileSync(inputPath, "utf8");

let signal = [...data];
let packetLength = 14;

let packetContainsDuplicates = (packet) => {
  for (let i = 0; i < packet.length; i++) {
    const letter = packet[i];
    for (let j = 0; j < packet.length; j++) {
      if (i != j && packet[i] == packet[j]) return true;
    }
  }
  return false;
};

let findFirstPacket = (signal, packetLength) => {
  for (let i = packetLength; i <= signal.length; i++) {
    let packet = signal.slice(i - packetLength, i);
    if (!packetContainsDuplicates(packet)) return { packet: packet, index: i };
  }
};

console.log(findFirstPacket(signal, packetLength));
