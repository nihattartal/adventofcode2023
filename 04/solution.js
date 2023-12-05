import fs from "fs";
import appRoot from "app-root-path"
import _ from "lodash"

const fileInput = fs.readFileSync(`${appRoot}/inputs/04/input.txt`, { encoding: 'utf8', flag: 'r' });
const data = fileInput.split("\n").map(x => x.trim());

class Card {
    constructor(winnerNumbers, numbersOnCard) {
        this.winnerNumbers = winnerNumbers;
        this.numbersOnCard = numbersOnCard;
        this.numberOfCopies = 1;
    }

    calulate() {
      return Math.floor(Math.pow(2, this.numbersOnCard.reduce((res, num) => {
        if (this.winnerNumbers.includes(num)) {
            return res + 1;
        }
        return res;
      }, 0) - 1));
    }
    
    numberOfUnlockedNextItems() {
      return this.numbersOnCard.reduce((res, num) => {
        if (this.winnerNumbers.includes(num)) {
            return res + 1;
        }
        return res;
      }, 0);
    }

    increaseNumberOfCopiesBy(n) {
        this.numberOfCopies += n;
    }

    getNumberOfCopies() {
        return this.numberOfCopies;
    }
}

const cardsArray = data.map(item => {
    const [winnerSection, cardSection] = item.split("|");
    const [_, numbersAsText] = winnerSection.split(":")
    const winnerNumbers = numbersAsText.trim().replaceAll("  ", " ").split(" ").map(x => parseInt(x));
    const playedNumbers = cardSection.trim().replaceAll("  ", " ").split(" ").map(x => parseInt(x));

    return new Card(winnerNumbers, playedNumbers);
});

const result1 = cardsArray.reduce((res, card) => {
    return res += card.calulate();
},0);

console.log(`Part 1: ${result1}`);

cardsArray.forEach((card, index) => {
    const nextNCards = card.numberOfUnlockedNextItems();
    for (let i = 1; i <= nextNCards; i++) {
        cardsArray[index + i].increaseNumberOfCopiesBy(card.getNumberOfCopies());
    }
});

const result2 = cardsArray.reduce((res, card) => {
    return card.getNumberOfCopies() + res;
}, 0);

console.log(`Part 2: ${result2}`);
// 3633 too low