import fs from "fs";
import appRoot from "app-root-path"
import _ from "lodash"

const fileInput = fs.readFileSync(`${appRoot}/inputs/14/example.txt`, { encoding: 'utf8', flag: 'r' });
const data = fileInput.split("\n").map(x => x.trim()).filter(x => !!x);

const matrix = data.map(x => x.split(''));

northMagnet();

function findNextRowIndexWithRock(row, col) {
  let found = -1;
  for (let i = row + 1; i < matrix.length; i++) {
    const foundItem = matrix[i][col];
    if (foundItem == "O") {
      return i;
    } else if (foundItem == "#") {
      return found;
    }
  }
  return found;
}

const part1 = matrix.reverse().reduce((res, row, rowIndex) => {
  const realRowIndex = rowIndex + 1;
  const count = row.reduce((rowCount, col) => {
    if (col == "O") {
      return rowCount + 1;
    }
    return rowCount;
  }, 0);
  return res + (count * realRowIndex);
}, 0);
console.log(`Part 1: ${part1}`);

function northMagnet() {
  matrix.forEach((row, rowIndex) => {
    return row.forEach((col, colIndex) => {
      if (col == ".") {
        const foundRockIndex = findNextRowIndexWithRock(rowIndex, colIndex);
        if (foundRockIndex !== -1) {
          matrix[foundRockIndex][colIndex] = ".";
          matrix[rowIndex][colIndex] = "O";
        }
      }
    })
  })
}