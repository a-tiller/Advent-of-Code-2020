const fs = require('fs');

const input = fs.readFileSync(__dirname + '/inputs/day12.input', 'utf8').split('\n');

function followDirections(directionList) {

  let eastWest = 0;
  let northSouth = 0;
  let facing = 1;
  const facings = ['N', 'E', 'S', 'W'];

  for (const direction of directionList) {
    let instruction = direction[0];
    const units = parseInt(direction.slice(1), 10);

    if (instruction === 'F') instruction = facings[facing];

    if (instruction === 'R') facing = (facing + (units / 90)) % 4;
    if (instruction === 'L') facing = (facing - (units / 90) + 4) % 4;

    else if (instruction === 'N') northSouth += units;
    else if (instruction === 'S') northSouth -= units;
    else if (instruction === 'E') eastWest += units;
    else if (instruction === 'W') eastWest -= units;
  }

  return {x: eastWest, y: northSouth};
}

function followWaypoint(directionList) {
  let shipEW = 0;
  let shipNS = 0;
  let waypointEW = 10;
  let waypointNS = 1;

  for (const direction of directionList) {
    let instruction = direction[0];
    const units = parseInt(direction.slice(1), 10);

    if (instruction === 'F') {
      shipEW += units * waypointEW;
      shipNS += units * waypointNS;
    }

    else if (instruction === 'N') waypointNS += units;
    else if (instruction === 'S') waypointNS -= units;
    else if (instruction === 'E') waypointEW += units;
    else if (instruction === 'W') waypointEW -= units;

    else if (instruction === 'R') {
      const newCoords = rotateWaypointRight(waypointEW, waypointNS, units / 90);
      waypointEW = newCoords.waypointEW;
      waypointNS = newCoords.waypointNS;
    }
    else if (instruction === 'L') {
      const newCoords = rotateWaypointLeft(waypointEW, waypointNS, units / 90);
      waypointEW = newCoords.waypointEW;
      waypointNS = newCoords.waypointNS;
    }
  }

  return {x: shipEW, y: shipNS};
}

function rotateWaypointLeft(waypointEW, waypointNS, rotations) {
  while (rotations) {
    [waypointEW, waypointNS] = [-waypointNS, waypointEW];
    rotations--;
  }

  return {waypointEW, waypointNS};
}

function rotateWaypointRight(waypointEW, waypointNS, rotations) {
  while (rotations) {
    [waypointEW, waypointNS] = [waypointNS, -waypointEW];
    rotations--;
  }

  return {waypointEW, waypointNS};
}

function manhattanDistance(coordinates) {
  const {x, y} = coordinates;

  return Math.abs(x) + Math.abs(y);
}

console.log("Part 1: ", manhattanDistance(followDirections(input)));
console.log("Part 2: ", manhattanDistance(followWaypoint(input)));