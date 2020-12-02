const fs = require('fs');

const input = fs.readFileSync(__dirname + '/inputs/day2.input', 'utf8').split('\n');

function parsePolicyPasswordPair(policyPasswordPair) {
  const [lowString, highString, letter, password] = policyPasswordPair.split(/[\s:-]+/);
  return [parseInt(lowString), parseInt(highString), letter, password];
}

function countValidPasswords(policyPasswordPairs, test) {
  return policyPasswordPairs
    .map(policyPasswordPair => parsePolicyPasswordPair(policyPasswordPair))
    .filter(policyAndPassword => test(...policyAndPassword))
    .length;
}

function isPartOneValid(min, max, letter, password) {
  const repeats = password.split('').filter((char) => (char === letter)).length;
  return min <= repeats && repeats <= max;
}

function isPartTwoValid(first, second, letter, password) {
  return (password[first - 1] === letter) ^ (password[second - 1] === letter);
}

console.log('Part 1: ', countValidPasswords(input, isPartOneValid));
console.log('Part 2: ', countValidPasswords(input, isPartTwoValid));
