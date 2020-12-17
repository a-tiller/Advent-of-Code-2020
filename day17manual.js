const fs = require('fs');

const input = fs.readFileSync(__dirname + '/inputs/day17.input', 'utf8').split('\n').map(row => row.split('').map((val) => (val === '#' ? 1 : 0)));

function makeEmptySpace(x, y, z, w) {
  return new Array(x).fill(0)
          .map(() => new Array(y).fill(0)
                      .map(() => new Array(z).fill(0)
                                  .map(() => new Array(w).fill(0))));
}

function initializeSpace(plane, cycles) {
  // the space where active cubes reside can grow by at most 1 in any given direction per cycle
  // so if we add double the number of cycles to the starting dimensions we know we will never
  // need to expand our container or change our perspective.
  let xSize = plane.length + (cycles * 2);
  let ySize = plane[0].length + (cycles * 2);
  let zSize = 1 + (cycles * 2);
  let wSize = 1 + (cycles * 2);

  const space = makeEmptySpace(xSize, ySize, zSize, wSize);

  // inset the starting plane so there's room to grow in every direction
  const startingPoint = cycles;

  for (let x = startingPoint; x < startingPoint + plane.length; x++) {
    for (let y = startingPoint; y < startingPoint + plane.length; y++) {
      space[x][y][startingPoint][startingPoint] = plane[x - startingPoint][y - startingPoint];
    }
  }

  return space;
}

function getVal(space, x, y, z, w) {
  // check bounds
  if (x < 0 || x >= space.length) return 0;
  if (y < 0 || y >= space[0].length) return 0;
  if (z < 0 || z >= space[0][0].length) return 0;
  if (w < 0 || w >= space[0][0][0].length) return 0;

  return space[x][y][z][w];
}

function notOrigin (coordinates) {
  for (const member of coordinates) {
    if (member !== 0) return true;
  }

  return false;
}

function make4dOffsets() {
  const offsets = [];

  for (let xVal = -1; xVal < 2; xVal++) {
    for (let yVal = -1; yVal < 2; yVal++) {
      for (let zVal = -1; zVal < 2; zVal++) {
        for (let wVal = -1; wVal < 2; wVal++) {
          offsets.push([xVal, yVal, zVal, wVal]);
        }
      }
    }
  }

  return offsets.filter(notOrigin);
}



function countImmediateNeighbors(space, x, y, z, w) {
  const offsets = make4dOffsets();
  let count = 0;

  for (const [xDiff, yDiff, zDiff, wDiff] of offsets) {
    count += getVal(space, x + xDiff, y + yDiff, z + zDiff, w + wDiff);
  }

  return count;
}

function iterate(space) {
  let xSize = space.length;
  let ySize = space[0].length;
  let zSize = space[0][0].length;
  let wSize = space[0][0][0].length;

  const nextIteration = makeEmptySpace(xSize, ySize, zSize, wSize);

  for (let x = 0; x < xSize; x++) {
    for (let y = 0; y < ySize; y++) {
      for (let z = 0; z < zSize; z++) {
        for (let w = 0; w < wSize; w++) {
          const count = countImmediateNeighbors(space, x, y, z, w);

          if (space[x][y][z][w] && (count === 2 || count === 3)) nextIteration[x][y][z][w] = 1;
          if (!space[x][y][z][w] && count === 3) nextIteration[x][y][z][w] = 1;
        }
      }
    }
  }

  return nextIteration;
}

function countActiveCubes(space) {
  let xSize = space.length;
  let ySize = space[0].length;
  let zSize = space[0][0].length;
  let wSize = space[0][0][0].length;

  let count = 0;

  for (let x = 0; x < xSize; x++) {
    for (let y = 0; y < ySize; y++) {
      for (let z = 0; z < zSize; z++) {
        for (let w = 0; w < zSize; w++) {
          if (space[x][y][z][w]) count++;
        }
      }
    }
  }

  return count;
}

function spaceAfterNCycles(plane, n) {
  let space = initializeSpace(plane, n);

  while (n > 0) {
    space = iterate(space);
    n--;
  }

  return space;
}

console.log("Part 2: ", countActiveCubes(spaceAfterNCycles(input, 6)));