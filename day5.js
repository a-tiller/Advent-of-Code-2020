const fs = require('fs');

const input = fs.readFileSync(__dirname + '/inputs/day5.input', 'utf8').split('\n');

function seatNumberOf(pass) {
  let seat = 0;

  for (const char of pass) {
    seat <<= 1;
    if (char === 'B' || char === 'R') seat += 1;
  }

  return seat;
}

function findEmptySeat(array, start, end) {
  for (let i = start; i < end; i++) {
    if (!array[i]) return i
  }

  return -1;
}

const seats = new Array(1024).fill(0);

let highestPass = -Infinity;
let lowestPass = Infinity;

for (const boardingPass of input) {
  const seat = seatNumberOf(boardingPass)
  highestPass = Math.max(highestPass, seat);
  lowestPass = Math.min(lowestPass, seat);
  seats[seat] = 1;
}

console.log("Part 1: ", highestPass);
console.log("Part 2: ", findEmptySeat(seats, lowestPass, highestPass));