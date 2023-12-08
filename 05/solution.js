import fs from "fs";
import appRoot from "app-root-path"

const fileInput = fs.readFileSync(`${appRoot}/inputs/05/example.txt`, { encoding: 'utf8', flag: 'r' });
const data = fileInput.split("\n").map(x => x.trim());

let converted = {
    newType: "seed",
    newTypeData: data.shift().split(" ").map(x => parseInt(x)).filter(x => !isNaN(x))
};

const DESTINATION = 0;
const SOURCE = 1;

const map = data.filter(x => x).reduce((acc, line) => {
    if (line.includes("map:")) {
        const [from, to] = line.split(" ")[0].split("-to-");
        acc.set(from, {
            to,
            mapping: []
        });
        acc.set("lastItem", from);
    } else {
      const parsedLine = line.trim().split(" ").map(x => parseInt(x));
      acc.get(acc.get("lastItem")).mapping.push(parsedLine);
    }
    return acc;
}, new Map());

map.delete("lastItem");

for (const key of map.keys()) {
    map.get(key).mapping.sort((a, b) => a[0] - b[0]);
}

while (converted.newType != "location") {
  converted = convert(converted.newType, converted.newTypeData, map);
}

function convert(type, data, map) {
    const conversion = map.get(type);
    return {
        newType: conversion.to,
        newTypeData: data.map(item => {
            const foundMapping = conversion.mapping.find(x => (x[SOURCE] + x[2]) > item && x[SOURCE] < item);
            if (foundMapping) {
                return item - (foundMapping[SOURCE] - foundMapping[DESTINATION])
            }
            return item;
        })
    }
}

const result1 = Math.min(...converted.newTypeData);
console.log(`Part 1: ${result1}`);

// Part 2
const data2 = fileInput.split("\n").map(x => x.trim());
let seedData = data2.shift().split(": ")[1]

const regExp = /\d+\s\d+/;
let matches = seedData.match(regExp)
const foundPairs = []
while (matches) {
    const found = matches[0];
    foundPairs.push(found);
    seedData = seedData.replace(found, "");
    matches = seedData.match(regExp);
}

class Pair {
    constructor(pairStr) {
        const [begin, range] = pairStr.split(" ").map(x => parseInt(x));
        this.start = begin;
        this.end = begin + range - 1;
    }

    getStart() {
        return this.start;
    }

    getEnd() {
        return this.end;
    }
}

class Mapping {
    constructor(pair, formula) {
        this.pair = pair;
        // SOURCE TO DESTINATION (What to add to source to get destination)
        this.formula = formula;
    }
}

const seedRanges = foundPairs.map(x => new Pair(x));
for (const key of map.keys()) {
    map.get(key).mapping = map.get(key).mapping.map(x => {
        const [dest, source, range] = x;
        const formula = dest - source;
        const pair = new Pair(`${source} ${range}`);
        return new Mapping(pair, formula);
    })
}

converted = {
    newType: "seed",
    newTypeData: seedRanges 
};

while (converted.newType != "location") {
  converted = convertPart2(converted.newType, converted.newTypeData, map);
}

function convertPart2(type, data, map) {
    const conversion = map.get(type);
    return {
        newType: conversion.to,
        newTypeData: data.map(item => {
            const foundMapping = conversion.mapping.find(x => (x[SOURCE] + x[2]) > item && x[SOURCE] < item);
            if (foundMapping) {
                return item - (foundMapping[SOURCE] - foundMapping[DESTINATION])
            }
            return item;
        })
    }
}