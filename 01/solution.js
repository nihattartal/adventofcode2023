import fs from "fs";
import appRoot from "app-root-path"

const fileInput = fs.readFileSync(`${appRoot}/inputs/01/input.txt`, { encoding: 'utf8', flag: 'r' });
const data = fileInput.split('\n');

const result1 = data.reduce((acc, line) => {
    const numbers = line.split('').filter(x => !isNaN(x)).map(x => parseInt(x));
    return acc + (numbers[0] * 10 + numbers.at(-1));
}, 0);

console.log(`Part 1: ${result1}`);