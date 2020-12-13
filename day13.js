const fs = require('fs');

const input = fs.readFileSync(__dirname + '/inputs/day13.input', 'utf8').split('\n');

function earliestDeparture(start, busses) {
  let best =  {
    busId: null,
    wait: null,
    departure: Infinity,
  };

  for (const busId of busses) {
    const wait = busId - (start % busId);
    const departure = start + wait;

    if (departure < best.departure) best = {busId, wait, departure};
  }

  return best
}

function makeBusPositions(busArray) {
  const busPositions = {};

  busArray.forEach((bus, index) => {
    if (bus !== 'x') busPositions[bus] = index;
  });

  return busPositions;
}

function earliestParade(busPositions) {
  let timeStart = 0;
  let timeIncrement = 1;

  const descendingBusPairs = Object.entries(busPositions).map(([bus, gap]) => [Number(bus), Number(gap)]).sort(([bus1, ], [bus2, ]) => (bus2 - bus1));

  for (const [bus, gap] of descendingBusPairs) {
    let time = timeStart;

    while(true) {
      if ((bus - (time % bus)) % bus === gap % bus) {
        timeStart = time;
        timeIncrement *= bus;
        break;
      }
      time += timeIncrement;
    }
  }

  return timeStart;
}


const now = parseInt(input[0], 10);
const busArray = input[1].split(',');

const busses = busArray.filter(bus => bus !== 'x').map(Number);
const best = earliestDeparture(now, busses);
console.log("Part 1: ", best.busId * best.wait);

console.log("Part 2: ", earliestParade(makeBusPositions(busArray)));