import fs from "fs";
import appRoot from "app-root-path"

class Game {
    constructor(id) {
        this.id = id;
        this.draws = []
    }

    addDraw(draw) {
      this.draws.push(draw);
    }
}

const TEMPLATE = {
    red: 0,
    green: 0,
    blue: 0,
}

function getNewConfCopy() {
    return {
        ...TEMPLATE
    }
}

const games = new Map();

const fileInput = fs.readFileSync(`${appRoot}/inputs/02/input.txt`, { encoding: 'utf8', flag: 'r' });
fileInput.split("\n").forEach(input => {
    const [rawGame, rawConf] = input.split(":");
    const gameId = parseInt(rawGame.replace("Game ", ""));
    const game = new Game(gameId)

    const draws = rawConf.split(";").map(x => x.trim());

    const parsedData = draws.map(rawData => {
        return rawData.split(",").map(x => x.trim()).reduce((acc, singleConf) => {
            const [count, color] = singleConf.split(" ");
            const numberCount = parseInt(count);
            acc[color] = numberCount;
            return acc;
        }, getNewConfCopy());
    })


    parsedData.forEach(x => game.addDraw(x));
    games.set(gameId, game)

});

for (const key of games.keys()) {
  games.get(key).draws = games.get(key).draws.reduce((accm, game) => {
    if (game.red > accm.red) {
        accm.red = game.red;
    }
    if (game.blue > accm.blue) {
        accm.blue = game.blue;
    }
    if (game.green > accm.green) {
        accm.green = game.green;
    }
    return accm;
  }, getNewConfCopy());
}

let result = 0;

games.forEach((g, gameId) => {
    const game = g.draws;
    //12 red cubes, 13 green cubes, and 14 blue cubes
    if (game.red > 12 || game.green > 13 || game.blue > 14) {
    } else {
      result += g.id
    }
})
console.log(`Part 1: ${result}`);

result = 0;

games.forEach((g, gameId) => {
    const game = g.draws;
    result += (game.red || 1) * (game.blue || 1) * (game.green || 1)
})

console.log(`Part 2: ${result}`);