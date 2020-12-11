
const fs = require('fs');

const input = fs.readFileSync(__dirname + '/inputs/day11.input', 'utf8').split('\n');

function getVal(seatMap, row, col) {
  // check bounds
  if (row < 0 || row >= seatMap.length) return 0;
  if (col < 0 || col >= seatMap[0].length) return 0;
  // check if there's a seat
  if (seatMap[row][col] === null) return 0;

  return seatMap[row][col];
}

function countImmediateNeighbors(seatMap, row, col) {
  const offsets = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
  let count = 0;

  for (const [rowDiff, colDiff] of offsets) {
    count += getVal(seatMap, row + rowDiff, col + colDiff);
  }

  return count;
}

function countVisibleNeighbors(seatMap, row, col) {
  const offsets = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
  let count = 0;

  for (const [rowDiff, colDiff] of offsets) {
    let [thisRow, thisCol] = [row, col];

    while (true) {
      thisRow += rowDiff;
      thisCol += colDiff;
      if (thisRow < 0 || thisRow >= seatMap.length || thisCol < 0 || thisCol >= seatMap[0].length) break;
      if (seatMap[thisRow][thisCol] !== null) {
        count += getVal(seatMap, thisRow, thisCol);
        break;
      }
    }
  }

  return count;
}

function iterate(seatMap, countingProcedure, limit) {
  let didChange = false;

  const neighborCount = new Array(seatMap.length).fill(0).map(_ => new Array(seatMap[0].length).fill(null));

  for (let row = 0; row < seatMap.length; row++) {
    for (let col = 0; col < seatMap[row].length; col++) {
      if (seatMap[row][col] !== null) neighborCount[row][col] = countingProcedure(seatMap, row, col);
    }
  }

  for (let row = 0; row < seatMap.length; row++) {
    for (let col = 0; col < seatMap[row].length; col++) {
      if (seatMap[row][col] === 0 && neighborCount[row][col] === 0) {
        seatMap[row][col] = 1;
        didChange = true;
      }

      if (seatMap[row][col] === 1 && neighborCount[row][col] >= limit) {
        seatMap[row][col] = 0;
        didChange = true;
      }
    }
  }

  return didChange;
}

function stabilize(seatMap, countingProcedure, limit) {
  let unstable = true;
  while (unstable) {
    unstable = iterate(seatMap, countingProcedure, limit);
  }
}

function countOccupants(seatMap) {
  return seatMap.reduce((count, row) => {
    return count + row.reduce((count, seat) => {
      return count + (seat ? 1 : 0);
    }, 0);
  }, 0);
}

const part1Map = input.map(row => row.split('').map(seat => seat === 'L' ? 0 : null));
stabilize(part1Map, countImmediateNeighbors, 4);
console.log("Part 1: ", countOccupants(part1Map));

const part2Map = input.map(row => row.split('').map(seat => seat === 'L' ? 0 : null));
stabilize(part2Map, countVisibleNeighbors, 5);
console.log("Part 2: ", countOccupants(part2Map));
