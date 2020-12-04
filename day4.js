const fs = require('fs');

const input = fs.readFileSync(__dirname + '/inputs/day4.input', 'utf8').split('\n\n');

function deserialize(serializedObject) {
  return serializedObject.split(/\s/)
                        .map(kvPair => kvPair.split(':'))
                        .reduce((deserialized, [key, value]) => ({...deserialized, [key]: value}), {});
}

function hasAllFields(object, requiredFields) {
  return requiredFields.every((field) => (field in object));
}

const passports = input.map(deserialize);

const requiredFields = [
  'byr',
  'iyr',
  'eyr',
  'hgt',
  'hcl',
  'ecl',
  'pid',
];

const wellFormedPassports = passports.filter((passport) => (hasAllFields(passport, requiredFields)));

const validationTests = {
  byr: ({ byr }) => (/^\d{4}$/.test(byr) && byr <= 2002 && byr >= 1920),
  iyr: ({ iyr }) => (/^\d{4}$/.test(iyr) && iyr <= 2020 && iyr >= 2010),
  eyr: ({ eyr }) => (/^\d{4}$/.test(eyr) && eyr <= 2030 && eyr >= 2020),
  hgt: ({ hgt }) => {
    if (!/^(\d+)(cm|in)$/.test(hgt)) return false;

    const [_, measurement, unit] = hgt.match(/^(\d+)(cm|in)$/)
    const limitsByUnit = {
      in: [59, 76],
      cm: [150, 193],
    }
    const [min, max] = limitsByUnit[unit];

    return measurement >= min && measurement <= max;
  },
  hcl: ({ hcl }) => (/^#[a-f\d]{6}$/.test(hcl)),
  ecl: ({ ecl }) => (/^amb|blu|brn|gry|grn|hzl|oth$/.test(ecl)),
  pid: ({ pid }) => (/^\d{9}$/.test(pid)),
};

const validatedPassports = wellFormedPassports.filter((passport) =>
  (Object.values(validationTests).every((test) => (test(passport))))
);

console.log('Part 1: ', wellFormedPassports.length);
console.log('Part 2: ', validatedPassports.length);
