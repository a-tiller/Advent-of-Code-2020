const fs = require('fs');

const input = fs.readFileSync(__dirname + '/inputs/day4.input', 'utf8').split('\n\n');

function isValidPassport(passport, requirements) {
  for (const [field, test] of requirements) {
    if (!passport.hasOwnProperty(field)) return false;
    if (!test(passport[field])) return false;
  }

  return true;
}

function makePassport(multilineString) {
  const passport = {};

  const passportPairs = multilineString.split(/\s/);

  for (const kvPair of passportPairs) {
    const [key, value] = kvPair.split(':');
    passport[key] = value;
  }

  return passport;
}

function countValidatedPassports(passportStrings, requirements) {
  let count = 0;

  for (const passportString of passportStrings) {
    if (isValidPassport(makePassport(passportString), requirements)) count++;
  }

  return count;
}

function isValidbyr(byr) {
  return /^\d{4}$/.test(byr) && byr <= 2002 && byr >= 1920;
}

function isValidiyr(iyr) {
  return /^\d{4}$/.test(iyr) && iyr <= 2020 && iyr >= 2010;
}

function isValideyr(eyr) {
  return /^\d{4}$/.test(eyr) && eyr <= 2030 && eyr >= 2020;
}

function isValidhgt(hgt) {
  if (!/^(\d+)(cm|in)$/.test(hgt)) return false;

  const [_, measurement, unit] = hgt.match(/^(\d+)(cm|in)$/)

  if (unit === 'in') {
    return measurement >= 59 && measurement <= 76;
  } else if (unit === 'cm') {
    return measurement >= 150 && measurement <= 193;
  }

  return false;
}

function isValidhcl(hcl) {
  return /^#[a-f\d]{6}$/.test(hcl);
}

function isValidecl(ecl) {
  return /^amb|blu|brn|gry|grn|hzl|oth$/.test(ecl);
}

function isValidpid(pid) {
  return /^\d{9}$/.test(pid);
}

const expectedFields = [['byr', isValidbyr],
                        ['iyr', isValidiyr],
                        ['eyr', isValideyr],
                        ['hgt', isValidhgt],
                        ['hcl', isValidhcl],
                        ['ecl', isValidecl],
                        ['pid', isValidpid]];

console.log(countValidatedPassports(input, expectedFields));

// console.log(isValidbyr(2002)) // true
// console.log(isValidbyr(2003)) // false

// console.log(isValidhgt('60in')) // true
// console.log(isValidhgt('190cm')) // true
// console.log(isValidhgt('190in')) // false
// console.log(isValidhgt('190')) // true

// console.log(isValidhcl('#123abc')) // true
// console.log(isValidhcl('#123abz')) // false
// console.log(isValidhcl('123abc')) // false

// console.log(isValidecl('brn')) // true
// console.log(isValidecl('wat')) // false

// console.log(isValidpid('000000001')) // true
// console.log(isValidpid('0123456789')) // false
