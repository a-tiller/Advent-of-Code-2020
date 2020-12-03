const fs = require('fs');

const input = fs.readFileSync(__dirname + '/inputs/day3.input', 'utf8').split('\n');

const treeMatrix = [];

for (const treeString of input) {
  treeMatrix.push(treeString.split(''));
}

let row = 0;
let col = 0;
let trees = 0;

while (row < treeMatrix.length) {
  if (treeMatrix[row][col] === '#') trees++;
  row++;
  col = (col + 3) % treeMatrix[0].length;
}

console.log(trees)

const offsets = [[1,1], [3,1], [5,1], [7,1], [1,2]];
const results = []

for (const offset of offsets) {
  row = 0;
  col = 0;
  trees = 0;

  while (row < treeMatrix.length) {
    if (treeMatrix[row][col] === '#') trees++;
    row += offset[1];
    col = (col + offset[0]) % treeMatrix[0].length;
  }

  results.push(trees);
}

console.log(results.reduce((a, v) => (a * v)))


