import fs from "fs";
import appRoot from "app-root-path"
import computeLcm from "compute-lcm"

const fileInput = fs.readFileSync(`${appRoot}/inputs/08/input.txt`, { encoding: 'utf8', flag: 'r' });
const data = fileInput.split("\n").map(x => x.trim()).filter(x => !!x);

const directions = data.shift().trim().split('');

class Location {
  constructor(location) {
    this.location = location;
    this.right = null;
    this.left = null;
  }

  setRight(rightLocation) {
    this.right = rightLocation;
  }

  setLeft(leftLocation) {
    this.left = leftLocation;
  }
}

const map = data.reduce((res, item) => {
  const { location, left, right } = parseItem(item);
  if (!res.has(location)) {
    res.set(location, new Location(location));
  }
  if (!res.has(left)) {
    res.set(left, new Location(left));
  }
  if (!res.has(right)) {
    res.set(right, new Location(right));
  }
  return res;
}, new Map());


data.reduce((res, item) => {
  const { location, left, right } = parseItem(item);
  const locationObj = res.get(location);
  if (location.right == null) {
    locationObj.setRight(res.get(right));
  }
  if (location.left == null) {
    locationObj.setLeft(res.get(left));
  }
  return res;
}, map);


function parseItem(item) {
  const [location, rawLeftRight] = item.split(" = ");
  const [left, right] = rawLeftRight.replace("(", "").replace(")", "").split(", ");
  return { location, left, right }
}

let lastFound = map.get('AAA')
let count = 0;

while (lastFound.location != "ZZZ") {
  const direction = directions[count % directions.length];
  const currentLocation = lastFound
  if (direction == "L") {
    lastFound = currentLocation.left;
    count++;
  } else {
    lastFound = currentLocation.right;
    count++;
  }
}

console.log(`Part 1: ${count}`);
const startingNodes = Array.from(map.keys()).filter(x => x.endsWith("A"));

const allFound = [];

startingNodes.forEach(start => {
  let count = 0;
  let lastFound = map.get(start)

  while (!lastFound.location.endsWith("Z")) {
    const direction = directions[count % directions.length];
    const currentLocation = lastFound
    if (direction == "L") {
      lastFound = currentLocation.left;
      count++;
    } else {
      lastFound = currentLocation.right;
      count++;
    }
  }
  allFound.push(count);
});


console.log(`Part 2: ${computeLcm(...allFound)}`);