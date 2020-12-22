const fs = require('fs');

const [deck1, deck2] = fs.readFileSync(__dirname + '/inputs/day22.input', 'utf8').split('\n\n').map(deck => deck.split('\n').slice(1).map(Number));

function playCombat(deck1, deck2) {
  while (deck1.length && deck2.length) {
    const card1 = deck1.shift();
    const card2 = deck2.shift();

    if (card1 > card2) {
      deck1.push(card1, card2);
    } else {
      deck2.push(card2, card1);
    }
  }

  return deck1.length ? deck1 : deck2;
}

function playRecursiveCombat(deck1, deck2) {
  const previouslyPlayed = [];

  while (deck1.length && deck2.length) {
    const serializedDeck1 = deck1.join('-');
    if (previouslyPlayed.includes(serializedDeck1)) return { winner: 1, winningDeck: deck1 };
    previouslyPlayed.push(serializedDeck1);

    const card1 = deck1.shift();
    const card2 = deck2.shift();
    let winner = 0;

    if (card1 <= deck1.length && card2 <= deck2.length) {
      winner = playRecursiveCombat(deck1.slice(0, card1), deck2.slice(0, card2)).winner;
    } else {
      winner = card1 > card2? 1 : 2;
    }

    if (winner === 1) {
      deck1.push(card1, card2);
    } else {
      deck2.push(card2, card1);
    }
  }

  return deck1.length ? { winner: 1, winningDeck: deck1 } : { winner: 2, winningDeck: deck2 }
}

function countScore(deck) {
  return deck.reverse().reduce((a, v, i) => (a + (v * (i + 1))), 0);
}

console.log("Part 1: ", countScore(playCombat([...deck1], [...deck2])));
console.log("Part 2: ", countScore(playRecursiveCombat([...deck1], [...deck2]).winningDeck));