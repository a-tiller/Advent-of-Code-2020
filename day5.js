const fs = require('fs');

const input = fs.readFileSync(__dirname + '/inputs/day5.input', 'utf8').split('\n');

function seatNumberOf(pass) {
  let min = 0;
  let max = 127;
  let position = 0;

  while (position < 7) {
    let mid = Math.floor((min + max) / 2);
    if (pass[position] === 'F') max = mid;
    else (min = mid)
    position++;
  }
  const row = max;

  min = 0;
  max = 7;

  while (position < 10) {
    let mid = Math.floor((min + max) / 2);
    if (pass[position] === 'L') max = mid;
    else (min = mid)
    position++
  }
  const col = max;

  return row * 8 + col;
}

// console.log(seatNumberOf('BFFFBBFRRR')) // 70, 7, 567
// console.log(seatNumberOf('FFFBBBFRRR')) // 14, 7, 119
// console.log(seatNumberOf('BBFFBBFRLL')) // 102, 4, 820

const seats = new Array(1024).fill(0);

let highestPass = -Infinity;

for (const boardingPass of input) {
  const seat = seatNumberOf(boardingPass)
  highestPass = Math.max(highestPass, seat);
  seats[seat] = 1;
}

let mySeat = -1;

for (let i = 0; i < 1024; i++) {
  if (seats[i] && !seats[i + 1]) {
    mySeat = i + 1;
    break;
  }
}

console.log("Part 1: ", highestPass);
console.log("Part 2: ", mySeat);