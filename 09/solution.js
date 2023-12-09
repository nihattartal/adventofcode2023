import fs from "fs";
import appRoot from "app-root-path"

const fileInput = fs.readFileSync(`${appRoot}/inputs/09/input.txt`, { encoding: 'utf8', flag: 'r' });
const data = fileInput.split("\n").map(x => x.trim()).filter(x => !!x);

class Seuence {
  constructor(seq) {
    if (typeof seq == 'string') {
      this.data = seq.split(/\s+/).map(x => parseInt(x));
    } else {
      this.data = seq;
    }
  }

  getNextSequence() {
    return new Seuence(this.data.reduce((res, item, index) => {
      if (index != 0) {
        res.push(item - this.data[index - 1]);
      }
      return res;
    },[]));
  }

  isAllZero() {
    return this.data.every(x => x === 0);
  }

  calculateNextVal() {
    const lastItem = this.data[this.data.length - 1];
    if (this.isAllZero()) {
      return 0;
    } else {
      const next = this.getNextSequence();
      return lastItem + next.calculateNextVal();
    }
  }

  calculatePrevVal() {
    const lastItem = this.data[0];
    if (this.isAllZero()) {
      return 0;
    } else {
      const next = this.getNextSequence();
      return lastItem - next.calculatePrevVal();
    }
  }
}
const document = data.map(line => new Seuence(line));
const part1 = document.reduce((res, item) => {
  return res + item.calculateNextVal();
}, 0)

console.log(`Part 1: ${part1}`);

const part2 = document.reduce((res, item) => {
  return res + item.calculatePrevVal();
}, 0)

console.log(`Part 2: ${part2}`);