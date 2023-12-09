import fs from "fs";
import appRoot from "app-root-path"

const fileInput = fs.readFileSync(`${appRoot}/inputs/07/input.txt`, { encoding: 'utf8', flag: 'r' });
const data = fileInput.split("\n").map(x => x.trim());
/*
7 Set size 1: Five of a kind, where all five cards have the same label: AAAAA
6 Set size 2: (4 - 1) Four of a kind, where four cards have the same label and one card has a different label: AA8AA
5 Set size 2: (3 - 2) Full house, where three cards have the same label, and the remaining two cards share a different label: 23332
4 Set size: 3: (3 - 1 - 1) Three of a kind, where three cards have the same label, and the remaining two cards are each different from any other card in the hand: TTT98
3 Set size: 3: (2 - 2 - 1) Two pair, where two cards share one label, two other cards share a second label, and the remaining card has a third label: 23432
2 Set size: 4: pair, where two cards share one label, and the other three cards have a different label from the pair and each other: A23A4
1 Set size 5: High card, where all cards' labels are distinct: 23456
*/

const cardOrder = ['A', 'K', 'Q', 'T', '9', '8', '7', '6', '5', '4', '3', '2', 'J'].reverse();

function findKindRank(c) {
  return cardOrder.indexOf(c);
}

class Hand {
  constructor(rawHandData) {
    const [rawHand, bid] = rawHandData.split(/\s+/);
    this.kinds = rawHand.split('')
    this.bid = parseInt(bid);
    const items = new Map();

    let count;
    for (const kind of this.kinds) {
      if (count = items.get(kind)) {
        items.set(kind, count + 1);
      } else {
        items.set(kind, 1);
      }
    }

    if ((items.get('J') || 0) > 0) {
      const sortedCounts = Array.from(items.entries()).sort((a,b) => b[1] - a[1]);
      const jCount = items.get('J');
      if (jCount == 5) {
        items.set("Q", 5);
      } else if (sortedCounts[0][0] != 'J') {
        items.set(sortedCounts[0][0], sortedCounts[0][1] + jCount);
      } else {
        items.set(sortedCounts[1][0], sortedCounts[1][1] + jCount);
      }
      items.delete("J");
    }


    this.rank = (() => {
      if (items.size == 1) {
        return 7;
      } else if (items.size == 2) {
        const rank = Array.from(items.values()).reduce((res, i) => {
          return res * i;
        }, 1);

        if (rank == 4) {
          return 6;
        } else {
          return 5;
        }
      } else if (items.size == 3) {
        const rank = Array.from(items.values()).reduce((res, i) => {
          return res * i;
        }, 1);

        if (rank == 3) {
          return 4;
        } else {
          return 3;
        }
      } else if (items.size == 4) {
        return 2;
      } else {
        // Item size is 5
        return 1;
      }
    })();
  }

  score() {
    return this.rank;
  }
}

const hands = data.map(x => new Hand(x));
hands.sort((a, b) => {
  const scoreA = a.score();
  const scoreB = b.score();

  if (scoreA < scoreB) {
    return -1;
  } else if (scoreA == scoreB) {
    for (let i = 0; i < a.kinds.length; i++) {
      const innerARank = findKindRank(a.kinds[i]);
      const innerBRank = findKindRank(b.kinds[i]);
      if (innerARank < innerBRank) {
        return -1;
      } else if (innerARank > innerBRank) {
        return 1;
      }
      continue;
    }
    return 0;
  } return 1;
});

const result = hands.reduce((res, item, index) => {
  return res + (item.bid * (index + 1));
}, 0)

console.log(`Part 2: ${result}`);
//255333497 too high
//255400301 your answer is too high
