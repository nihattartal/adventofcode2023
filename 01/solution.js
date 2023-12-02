import fs from "fs";
import appRoot from "app-root-path"

const fileInput = fs.readFileSync(`${appRoot}/inputs/01/input.txt`, { encoding: 'utf8', flag: 'r' });
const data = fileInput.split('\n');

const result1Data = data;

const result1 = result1Data.reduce(calculate, 0);
console.log(`Part 1: ${result1}`);

const result2Data = data.map(line => {
    return line
      .replaceAll('one', 'o1e')
      .replaceAll('two', 't2o')
      .replaceAll('three', 't3e')
      .replaceAll('four', '4')
      .replaceAll('five', '5e')
      .replaceAll('six', '6')
      .replaceAll('seven', '7n')
      .replaceAll('eight', 'e8t')
      .replaceAll('nine', 'n9e')
})

const result2 = result2Data.reduce(calculate, 0)
console.log(`Part 2: ${result2}`);

function calculate(acc, line) {
    const numbers = line.split('').filter(x => !isNaN(x)).map(x => parseInt(x));
    return acc + (numbers[0] * 10 + numbers.at(-1));
}