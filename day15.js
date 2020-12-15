const input = [1,0,16,5,17,4]

// 6m runtime:

// function numberGame(startingNumbers, turn) {
//   const turnHash = {}

//   for (let i = 0; i < startingNumbers.length - 1; i++) {
//     turnHash[startingNumbers[i]] = i + 1;
//   }
//   let currentTurn = startingNumbers.length;
//   let prev = startingNumbers[startingNumbers.length - 1];

//   while (currentTurn < turn) {
//     let nextNum = 0;

//     if (prev in turnHash) {
//       nextNum = currentTurn - turnHash[prev];
//     }

//     turnHash[prev] = currentTurn;
//     prev = nextNum;
//     currentTurn++;
//   }

//   return prev;
// }



// 5s runtime:

function numberGame(startingNumbers, turn) {
  const turnHash = new Map();

  for (let i = 0; i < startingNumbers.length - 1; i++) {
    turnHash.set(startingNumbers[i], i + 1);
  }
  let currentTurn = startingNumbers.length;
  let prev = startingNumbers[startingNumbers.length - 1];

  while (currentTurn < turn) {
    const lastSeen = turnHash.get(prev);
    const nextNum = lastSeen ? currentTurn - lastSeen : 0;

    turnHash.set(prev, currentTurn);
    prev = nextNum;
    currentTurn++;
  }

  return prev;
}

console.log("Part 1: ", numberGame(input, 2020)); // 1294
console.log("Part 2: ", numberGame(input, 30000000)); // 573522