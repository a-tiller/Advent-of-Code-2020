const fs = require('fs');

let policyPasswordPairs = [];

fs.readFile(__dirname + '/inputs/day2.input', function (err, data) {
  policyPasswordPairs = data.toString().split('\n');

  let validPasswords = 0;
  // part 1
  for (const pair of policyPasswordPairs) {
    const [count, letter, string] = pair.split(' ');
    const [min, max] = count.split('-');
    let occurrences = 0;

    for (let i = 0; i < string.length; i++) {
      if (string[i] === letter[0]) occurrences++;
    }

    if (occurrences >= min && occurrences <= max) {
      validPasswords++;
    }
  }

  console.log('Part 1: ', validPasswords);

  validPasswords = 0;

  //part 2
  for (const pair of policyPasswordPairs) {
    const [positions, letter, string] = pair.split(' ');
    const [firstPosition, secondPosition] = positions.split('-');

    if ((string[firstPosition - 1] === letter[0] || string[secondPosition - 1] === letter[0])
        && string[firstPosition - 1] !== string[secondPosition - 1]) {
      validPasswords++;
    }
  }

  console.log('Part 2: ', validPasswords);
});

