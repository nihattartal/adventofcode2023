import fs from "fs";
import appRoot from "app-root-path"

/// Classes

class EnginePart {
  constructor(strNumber) {
    this.val = parseInt(strNumber);
    this.visited = false;
    this.activatedBy = new Set();
  }

  getValue() {
    return this.val;
  }

  isVisited() {
    return this.visited;
  }

  setVisited() {
    this.visited = true;
  }

  isActive() {
    return this.activatedBy.size > 0;
  }

  setActivatedBy(id) {
    this.activatedBy.add(id);
  }
}

class Connector {
  constructor(id) {
    this.id = id;
  }

  getId() {
    return this.id;
  }
}

/////

const fileInput = fs.readFileSync(`${appRoot}/inputs/03/input.txt`, { encoding: 'utf8', flag: 'r' });
const data = fileInput.split("\n").map(x => x.trim());

const matrix = data.reduce((result, line, index) => {
  const reg = RegExp(/\d+/,'g');
  let match;
  while (match = reg.exec(line)) {
    const stringNumber = match[0];
    const location = match.index;
    const part = new EnginePart(stringNumber);
    for (let i = 0; i < stringNumber.length; i++) {
      result[index][i + location] = part;
    }
  }
  return result;
}, new Array(data.length).fill(0).map(() => new Array(data[0].length)))// [y][x]);

data.reduce((result, line, index) => {
  line.split('').forEach((ch, i) => {
    if (isNaN(ch) && ch != '.') {
      result[index][i] = new Connector(`${index}-${i}`);
    }
  })
  return result;
}, matrix);

function markActiveByCheckingNeighbors(y, x, matrix) {
  const cursor = matrix[y][x];
  if (cursor instanceof EnginePart) {
    let j = y - 1;
    for (let j = y - 1; j <= y + 1; j++) {
      if (j >= 0 && j < matrix.length) {
        for (let i = x - 1; i <= x + 1; i++) {
          if (i >= 0 && i < matrix[0].length) {
            // HERE CHECK if neighbor is special char.
            if (matrix[j][i] instanceof Connector) {
              cursor.setActivatedBy((matrix[j][i]).getId());
            }
          }
        }
      }
    }
  }
}

data.reduce((result, line, index) => {
  line.split('').forEach((ch, i) => {
    markActiveByCheckingNeighbors(index, i, result);
  })
  return result;
}, matrix);

const result = matrix.reduce((result, line) => {
  let lineResult = 0; 
  line.filter(x => (x instanceof EnginePart)).forEach((item, i) => {
    if (item.isActive()) {
      if (!item.isVisited()) {
        item.setVisited();
        lineResult += item.getValue();
      }
    }
  })
  return result + lineResult;
}, 0);

console.log(`Part 1: ${result}`);