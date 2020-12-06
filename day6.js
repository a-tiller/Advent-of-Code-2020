const fs = require('fs');

const input = fs.readFileSync(__dirname + '/inputs/day6.input', 'utf8').split('\n\n');


function anyYes(group) {
  const anyYes = new Set(group.join(''));

  return anyYes.size;
}

function allYes(group) {
  const allYes = new Set(group[0]);

  for (let i = 1; i < group.length; i++) {
    const member = new Set(group[i]);

    allYes.forEach(value => {
      if (!member.has(value)) allYes.delete(value);
    });

    if (!allYes.size) return 0;
  }

  return allYes.size;
}

const findTotalOf = (array, predicate = (v) => (v)) => (array.map(predicate).reduce((a, b) => (a + b)));

const groups = input.map(group => group.split('\n'));

console.log("Part 1: ", findTotalOf(groups, anyYes));
console.log("Part 2: ", findTotalOf(groups, allYes));