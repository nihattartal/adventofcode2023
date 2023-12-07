import fs from "fs";
import appRoot from "app-root-path"

const fileInput = fs.readFileSync(`${appRoot}/inputs/06/input.txt`, { encoding: 'utf8', flag: 'r' });
const data = fileInput.split("\n").map(x => x.trim());

const document = data.reduce((res, line) => {
    const [label, rawData] = line.split(":").map(x => x.trim());
    const gameData = rawData.replace(/\s+/g, " ").split(" ").map(x => parseInt(x));
    res.set(label, gameData);
    return res;
}, new Map())

const result = document.get("Time").reduce((res, timeData, index) => {
  const recordTime = document.get("Distance")[index];
  
  let numberOfWins = 0;
  for (let i = 0; i <= timeData; i++) {
    const wait = i;
    const remainintTime = timeData - i;

    const distance = wait * remainintTime;
    if (distance > recordTime) {
      numberOfWins++;
    } 
  }
  return res * numberOfWins;
}, 1);

console.log(`Part 1: ${result}`);