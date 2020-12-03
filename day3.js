const fs = require('fs');

const input = fs.readFileSync(__dirname + '/inputs/day3.input', 'utf8').split('\n');

function tobogganCrashes(rightOffset, downOffset, terrain) {
  const altitude = terrain.length;
  const repeatWidth = terrain[0].length;

  let row = 0;
  let col = 0;
  let collisions = 0;

  while (row < altitude) {
    if (terrain[row][col] === '#') collisions++;
    row = row + downOffset;
    col = (col + rightOffset) % repeatWidth;
  }

  return collisions;
}

console.log('Part 1: ', tobogganCrashes(3, 1, input));

const slopes = [[1,1], [3,1], [5,1], [7,1], [1,2]];

console.log('Part 2: ', slopes.reduce((accumulator, [right, down]) => (accumulator * tobogganCrashes(right, down, input)), 1));
