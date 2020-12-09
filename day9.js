const fs = require('fs');

const input = fs.readFileSync(__dirname + '/inputs/day9.input', 'utf8').split('\n').map(Number);

const PREAMBLE = 25;

function firstInvalid(series, windowSize) {
  let position = 0;
  let window = new Set();

  while (position < windowSize /* && position < series.length */) {
    window.add(series[position]);
    position++;
  }

  for ( ; position < series.length; position++) {
    const current = series[position];

    let found = false;

    for (const member of window) {
      if (window.has(current - member)) {
        found = true;
        break;
      }
    }

    if (!found) return current;

    window.delete(series[position - windowSize]);
    window.add(current);
  }

  return null;
}

function subArrayThatSumsTo(series, target) {

  const prefixSums = new Array(series.length);

  series.forEach((number, index) => {
    prefixSums[index] = number + (prefixSums[index - 1] || 0);
  });

  for (let end = 1; end < prefixSums.length; end++) {
    for (let start = 0; start < end; start++) {
      const difference = prefixSums[end] - (prefixSums[start - 1] || 0);
      if (difference === target) return input.slice(start, end + 1);
    }
  }

  return null;
}

const weakPoint = firstInvalid(input, PREAMBLE);

console.log("Part 1: ", weakPoint);

const range = subArrayThatSumsTo(input, weakPoint);

console.log("Part 2: ", Math.min(...range) + Math.max(...range));