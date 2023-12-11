import fs from "fs";
import appRoot from "app-root-path"
import _ from "lodash"

const fileInput = fs.readFileSync(`${appRoot}/inputs/10/input.txt`, { encoding: 'utf8', flag: 'r' });
const data = fileInput.split("\n").map(x => x.trim()).filter(x => !!x);

const matrix = data.reverse().map(x => x.split(''));

const DIRECTIONS = {
    "-": {
        LEFT: {
            MOVE: [0, -1],
            NEW_DIRECTION: "LEFT",
        },
        RIGHT: {
            MOVE: [0, 1],
            NEW_DIRECTION: "RIGHT",
        }
    },

    "|": {
        UP: {
            MOVE: [1, 0],
            NEW_DIRECTION: "UP",
        },
        DOWN: {
            MOVE: [-1, 0],
            NEW_DIRECTION: "DOWN"
        }
    },
    "7": {
        UP: {
            MOVE: [0, -1],
            NEW_DIRECTION: "LEFT"
        },
        RIGHT: {
            MOVE: [-1, 0],
            NEW_DIRECTION: "DOWN"
        }
    },
    "F": {
        UP: {
            MOVE: [0, 1],
            NEW_DIRECTION: "RIGHT"
        },
        LEFT: {
            MOVE: [-1, 0],
            NEW_DIRECTION: "DOWN"
        }
    },
    "J": {
        DOWN: {
            MOVE: [0, -1],
            NEW_DIRECTION: "LEFT"
        },
        RIGHT: {
            MOVE: [1, 0],
            NEW_DIRECTION: "UP"
        }
    },
    "L": {
        DOWN: {
            MOVE: [0, 1],
            NEW_DIRECTION: "RIGHT"
        },
        LEFT: {
            MOVE: [1, 0],
            NEW_DIRECTION: "UP"
        }
    },
}

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    getNeighbors() {
        const directions = [[0, -1],[0, 1],[1, 0], [-1, 0]];
        const neighbors = [];
        directions.map(([x, y]) => {
          if (this.x + x >= 0 && this.x + x < matrix[0].length) {
            if (this.y + y >= 0 && this.y + y < matrix.length) {
              if (matrix[this.y + y][this.x + x] !== ".") {
                neighbors.push({
                    point: new Point(this.x + x, this.y + y),
                    direction: (() => {
                      if (y === 1) {
                        return "UP";
                      } else if (y === -1) {
                        return "DOWN";
                      } else if(x === 1) {
                        return "RIGHT"
                      } else {
                        return "LEFT";
                      }
                    })()
                });
              }
            }
          }
        });
        return neighbors;
    }

    equals(anotherPoint) {
        return this.x == anotherPoint.x && this.y == anotherPoint.y;
    }

    toString() {
        return `${this.x}-${this.y}`;
    }
}

let initialPoint;
matrix.find((row, rowIndex) => {
    row.find((col, colIndex) => {
        if (col === 'S') {
          initialPoint = new Point(colIndex, rowIndex);
        }
    })
});

class Move {
    constructor(matrix, currentPoint, direction) {
        this.matrix = matrix;
        this.visitedNodes = new Set();
        this.walkDistance = 1;
        this.currentPoint = currentPoint
        this.visitedNodes.add(currentPoint.toString())
        this.direction = direction;
    }

    walkAndGetCount() {
        const currentItem = matrix[initialPoint.y][initialPoint.x];
        while ((this.currentPoint != null) && !initialPoint.equals(this.currentPoint) ) {
           let parentDir = DIRECTIONS[matrix[this.currentPoint.y][this.currentPoint.x]]
           if (!parentDir) {
             return 0;
           }
           let dir = parentDir[this.direction]
           if (dir) {
            this.direction = dir.NEW_DIRECTION;
            this.currentPoint = new Point(this.currentPoint.x + dir.MOVE[1], this.currentPoint.y + dir.MOVE[0]);
            this.walkDistance++;
           } else {
            return 0;
           }
        }
        return this.walkDistance;
    }
}

const result = initialPoint.getNeighbors().reduce((res, movePoint) => {
  const move = new Move(matrix, movePoint.point, movePoint.direction);
  const max = Math.max(move.walkAndGetCount(), res);
  return max;
}, 0) / 2;

console.log(`Part 1: ${result}`);
