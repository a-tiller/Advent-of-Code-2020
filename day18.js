const fs = require('fs');

const input = fs.readFileSync(__dirname + '/inputs/day18.input', 'utf8').split('\n');

function windDown(expression, precedence, functions) {
  const numbers = [];
  const operators = [];

  while (expression.length) {
    const symbol = expression.shift();

    if (symbol in functions) {
      operators.push(symbol)
      continue;
    }

    numbers.push(Number(symbol));

    if (operators.length && precedence[operators[operators.length - 1]]) {
      const operator = operators.pop()
      const a = numbers.pop();
      const b = numbers.pop();
      numbers.push(functions[operator](a, b));
    }
  }

  let result = numbers.pop();

  while (numbers.length) {
    const operator = operators.pop();
    const number = numbers.pop();
    result = functions[operator](number, result);
  }

  return result.toString();
}

function calculator(expression, precedence) {
  expression = expression.split('').filter(symbol => (symbol !== ' '));
  const symbolStack = [];
  let position = 0;

  while (position < expression.length) {
    const current = expression[position];
    position++;

    if (current !== ')') {
      symbolStack.push(current);
      continue;
    }

    const subExpression = [];

    while (symbolStack.length && symbolStack[symbolStack.length - 1] !== '(') {
      subExpression.unshift(symbolStack.pop());
    }
    // remove the leading ( if there is one
    symbolStack.pop();

    symbolStack.push(windDown(subExpression, precedence, functions));
  }

  // wind down any remaining stack
  return Number(windDown(symbolStack, precedence, functions));
}

function sumOfExpressionResults(expressions, evaluate, precedence, functions) {
  return expressions.reduce((sum, expression) => (sum + evaluate(expression, precedence, functions)), 0);
}


let precedence = { '+': 1, '*': 1 };
let functions = { '+': (a, b) => (a + b), '*': (a, b) => (a * b) }
// let testExpression = '2 * 3 + (4 * 5)';
// console.log(calculator(testExpression, precedence, functions)); // 26
// testExpression = '5 + (8 * 3 + 9 + 3 * 4 * 3)';
// console.log(calculator(testExpression, precedence, functions)); // 437
// testExpression = '5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4))';
// console.log(calculator(testExpression, precedence, functions)); // 12240
// testExpression = '((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2';
// console.log(calculator(testExpression, precedence, functions)); // 13632
console.log('Part 1: ', sumOfExpressionResults(input, calculator, precedence, functions));
precedence = { '+': 1, '*': 0 };
// testExpression = '1 + (2 * 3) + (4 * (5 + 6))';
// console.log(calculator(testExpression, precedence, functions)); // 51
// testExpression = '2 * 3 + (4 * 5)';
// console.log(calculator(testExpression, precedence, functions)); // 46
// testExpression = '5 + (8 * 3 + 9 + 3 * 4 * 3)';
// console.log(calculator(testExpression, precedence, functions)); // 1445
// testExpression = '5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4))';
// console.log(calculator(testExpression, precedence, functions)); // 669060
// testExpression = '((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2';
// console.log(calculator(testExpression, precedence, functions)); // 23340
console.log('Part 2: ', sumOfExpressionResults(input, calculator, precedence, functions));
