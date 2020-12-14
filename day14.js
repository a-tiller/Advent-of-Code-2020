const fs = require('fs');

const input = fs.readFileSync(__dirname + '/inputs/day14.input', 'utf8').split('\n');

function applyMask(maskString, number) {
  const maskArray = maskString.split('');
  let place = BigInt(0);

  while (maskArray.length) {
    const current = maskArray.pop();

    if (current === '1') number |= BigInt(1) << place;
    else if (current === '0' && ((number >> place) & BigInt(1))) number -= BigInt(1) << place;

    place++
  }

  return number;
}

function applyFloatingBitMask(maskString, address) {
  let maskedAddresses = [address];
  const maskArray = maskString.split('');
  let place = BigInt(0);

  while (maskArray.length) {
    const current = maskArray.pop();

    if (current === '1') {
      maskedAddresses.forEach((number, index) => {
        maskedAddresses[index] = number | BigInt(1) << place;
      });
    } else if (current === 'X') {
      const doubledAddresses = [];

      for (const number of maskedAddresses) {
        const withOne = number | BigInt(1) << place;
        const withZero = ((number >> place) & BigInt(1)) ? number - (BigInt(1) << place) : number;
        doubledAddresses.push(withOne, withZero);
      }

      maskedAddresses = doubledAddresses;
    }

    place++
  }

  return maskedAddresses;
}

function valueMaskInitialize(instructions, maskingFunction) {
  const memory = {};
  let mask = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';

  for (let instruction of instructions) {
    instruction = instruction.split(' = ');

    if (instruction[0] === 'mask') {
      mask = instruction[1];
      continue;
    }

    const address = instruction[0].match(/\d+/);
    memory[address] = maskingFunction(mask, BigInt(instruction[1]));
  }

  return memory
}

function addressMaskInitialize(instructions, maskingFunction) {
  const memory = {};
  let mask = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';

  for (let instruction of instructions) {
    instruction = instruction.split(' = ');

    if (instruction[0] === 'mask') {
      mask = instruction[1];
      continue;
    }

    const givenAddress = BigInt(instruction[0].match(/\d+/));
    const maskedAddresses = maskingFunction(mask, givenAddress);

    for (const address of maskedAddresses) {
      memory[address] = BigInt(instruction[1])
    }
  }

  return memory
}

function sumOfInitializedValues(instructions, initializer, masker) {
  return Number(Object.values(initializer(instructions, masker)).reduce((a, b) => (a + b), BigInt(0)));
}


console.log("Part 1: ", sumOfInitializedValues(input, valueMaskInitialize, applyMask));
console.log("Part 2: ", sumOfInitializedValues(input, addressMaskInitialize, applyFloatingBitMask));