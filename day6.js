const fs = require('fs');

const input = fs.readFileSync(__dirname + '/inputs/day6.input', 'utf8').split('\n\n');

function anyYes(group) {
  const individuals = group.split('\n');
  const anyYes = new Set(individuals.join(''));

  return anyYes.size;
}

function allYes(group) {
  const individuals = group.split('\n');
  const allYes = new Set(individuals[0]);

  for (let i = 1; i < individuals.length; i++) {
    const current = new Set(individuals[i]);

    allYes.forEach(value => {
      if (!current.has(value)) allYes.delete(value);
    });
  }

  return allYes.size;
}

console.log("Part 1: ", input.map(anyYes).reduce((a, b) => (a + b)));
console.log("Part 2: ", input.map(allYes).reduce((a, b) => (a + b)));