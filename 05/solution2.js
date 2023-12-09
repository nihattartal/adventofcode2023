import fs from "fs";
import appRoot from "app-root-path"

const fileInput = fs.readFileSync(`${appRoot}/inputs/05/input.txt`, { encoding: 'utf8', flag: 'r' });
const data = fileInput.split("\n").map(x => x.trim());

class Pair {
    constructor(begin, times) {
        this.start = begin;
        this.end = begin + times - 1;
    }

    getStart() {
        return this.start;
    }

    getEnd() {
        return this.end;
    }

    isIn(num) {
      return this.start <= num && this.end >= num;
    }
}

class Mapping {
    constructor(pair, formula) {
        this.pair = pair;
        // SOURCE TO DESTINATION (What to add to source to get destination)
        this.formula = formula;
    }
}

class Item {
    constructor(name) {
        this.name = name;
        this.forwardMappings = [];
        this.backwardMappings = [];
        this.next = null;
        this.previous = null;
    }

    setNext(item) {
      this.next = item; 
    }

    setPrevious(item) {
        this.previous = item;
    }

    setForwardMapping(mapping) {
        this.forwardMappings.push(mapping);
    }

    setBackwardMappings(mapping) {
        this.backwardMappings.push(mapping);
    }
}

let rawSeed = data.shift();
const regExp = /\d+\s\d+/;
let matches = rawSeed.match(regExp)
const seedPairs = []
while (matches) {
    const found = matches[0];
    seedPairs.push(new Pair(...(found.split(" ").map(x => parseInt(x)))));
    rawSeed = rawSeed.replace(found, "");
    matches = rawSeed.match(regExp);
}

seedPairs.sort((a, b) => a.start - b.start);


let lastItem = "";
let lastBackwardsItem = "";
const map = data.filter(x => !!x).reduce((map, line) => {
    if (line.includes("map:")) {
        const [from, to] = line.split(" ")[0].split("-to-");
        lastItem = from;
        const fromObject = (() => {
            if (!map.has(from)) {
               map.set(from, new Item(from));
            }
            return map.get(from);
        })();

        lastBackwardsItem = to;
        const toObject = (() => {
            if (!map.has(to)) {
               map.set(to, new Item(to));
            }
            return map.get(to);
        })();
        
        fromObject.setNext(toObject);
        toObject.setPrevious(fromObject);
    } else {
      const [destination, source, times] = line.trim().split(" ").map(x => parseInt(x));
      map.get(lastItem).setForwardMapping(new Mapping(new Pair(source, times), destination - source));
      map.get(lastBackwardsItem).setBackwardMappings(new Mapping(new Pair(destination, times), source - destination));
    }
    return map;
}, new Map());

let found = false;
let counter = 0;
let counterDerived = 0;
while (!found) {
    let previous = map.get("location");
    while (previous != null) {
       const foundInner = previous.backwardMappings.find(x => x.pair.isIn(counterDerived)) 
       if (foundInner) {
         counterDerived += foundInner.formula; 
       }
       previous = previous.previous;
    }

    // This is seeds things
    if (seedPairs.find(x => x.isIn(counterDerived))) {
        found = true;
    }
    counter++;
    counterDerived = counter;
}

console.log(counter - 1);