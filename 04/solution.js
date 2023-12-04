import fs from "fs";
import appRoot from "app-root-path"
import _ from "lodash"

const fileInput = fs.readFileSync(`${appRoot}/inputs/04/input.txt`, { encoding: 'utf8', flag: 'r' });
const data = fileInput.split("\n").map(x => x.trim());

class Card {
    constructor(winnerNumbers, numbersOnCard) {
        this.winnerNumbers = winnerNumbers;
        this.numbersOnCard = numbersOnCard;
    }

    calulate() {
      return Math.floor(Math.pow(2, this.numbersOnCard.reduce((res, num) => {
        if (this.winnerNumbers.includes(num)) {
            return res + 1;
        }
        return res;
      }, 0) - 1));
    }
}

const result1 = data.reduce((res, item) => {
    const [winnerSection, cardSection] = item.split("|");
    const [_, numbersAsText] = winnerSection.split(":")
    const winnerNumbers = numbersAsText.trim().replaceAll("  ", " ").split(" ").map(x => parseInt(x));
    const playedNumbers = cardSection.trim().replaceAll("  ", " ").split(" ").map(x => parseInt(x));

    const card = new Card(winnerNumbers, playedNumbers);
    return res += card.calulate();
},0);

console.log(`Part 1: ${result1}`);
