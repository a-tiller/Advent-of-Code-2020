const fs = require('fs');

const input = fs.readFileSync(__dirname + '/inputs/day8.input', 'utf8').split('\n');

const parsedInput = input.map(instruction => (instruction.split(' ')))
                         .map(([code, val]) => [code, parseInt(val)]);

function valueUpToRepeat(instructionList) {
  const executed = new Set();
  let accumulator = 0;

  let position = 0;
  let isClean = true;

  while (position < instructionList.length) {
    executed.add(position);

    const [code, val] = instructionList[position];

    if (code === 'nop') {
      position++;
    } else if (code === 'acc') {
      accumulator += val;
      position++;
    } else if (code === 'jmp') {
      position += val;
    }

    if (executed.has(position)) {
      isClean = false;
      break;
    }
  }

  return {isClean, accumulator};
}

function corruptionRepair(instructionList) {
  for (let i = 0; i < instructionList.length; i++) {
    const [code, val] = instructionList[i];
    const toggle = ['nop', 'jmp'];

    if (code === 'acc') continue;

    const toggleTarget = (toggle.indexOf(code) + 1) % 2;
    instructionList[i][0] = toggle[toggleTarget];
    const result = valueUpToRepeat(instructionList);
    if (result.isClean) {
      console.log('Fix is at: ', i)
      return result.accumulator;
    }
    const toggleBack = (toggleTarget + 1) % 2;
    instructionList[i][0] = toggle[toggleBack];
  }

  return -1;
}

console.log("Part 1: ", valueUpToRepeat(parsedInput).accumulator);
console.log("Part 2: ", corruptionRepair(parsedInput));