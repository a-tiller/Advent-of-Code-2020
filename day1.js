const fs = require('fs');

let expenses = [];

fs.readFile(__dirname + '/inputs/day1.input', function (err, data) {
  expenses = data.toString().split('\n').map((v) => (+v));

  expenses.sort((a, b) => (a - b));

  const TARGET = 2020;
  let left = 0;
  let right = expenses.length - 1;

  while (left < right) {
    const sum = expenses[left] + expenses[right];

    if (sum === TARGET) {
      console.log(`The product of two numbers that sum to ${TARGET} is: `, expenses[left] * expenses[right]);
      break;
    }

    if (sum < TARGET) left++;
    else right--;
  }

  for (let i = 0; i < expenses.length; i++) {
    const remaining = TARGET - expenses[i];

    left = i + 1;
    right = expenses.length - 1;

    while (left < right) {
      const sum = expenses[left] + expenses[right];

      if (sum === remaining) {
        console.log(`The product of three numbers that sum to ${TARGET} is: `, expenses[i] * expenses[left] * expenses[right]);
        return;
      }

      if (sum < TARGET) left++;
      else right--;
    }
  }
});

