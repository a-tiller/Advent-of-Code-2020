const fs = require('fs');

const input = fs.readFileSync(__dirname + '/inputs/day10.input', 'utf8').split('\n').map(Number);

function differences(adapters) {
  let [one, two, three] = [0, 0, 0];

  for (let i = 1; i < adapters.length; i++) {
    const step = adapters[i] - adapters[i - 1];

    if (step === 1) {
      one++;
    } else if (step === 2) {
      two++;
    } else if (step === 3) {
      three++
    } else if (step === 0) {
      console.log("You packed a duplicate adapter");
    } else {
      console.log("Something went wrong: step too large");
    }
  }

  return {one, two, three};
}


function arrangements(adapters) {
  const paths = new Array(adapters.length).fill(0);
  paths[0] = 1;

  adapters.forEach((adapter, index) => {
    let connection = index - 1;

    while (connection >= 0 && (adapter - adapters[connection] <= 3)) {
      paths[index] += paths[connection];
      connection--;
    }
  });

  return paths[paths.length - 1];
}

input.sort((a, b) => (a - b));
const WALL = 0;
const DEVICE = input[input.length - 1] + 3;
const fullChain = [WALL, ...input, DEVICE];

const useAll = differences(fullChain);

console.log("Part 1: ", useAll.one * useAll.three);
console.log("Part 2: ", arrangements(fullChain));