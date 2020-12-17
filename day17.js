const fs = require('fs');

const input = fs.readFileSync(__dirname + '/inputs/day17.input', 'utf8').split('\n').map(row => row.split('').map((val) => (val === '#' ? 1 : 0)));

function makeEmptySpace(x, y, z) {
  return new Array(x).fill(0)
          .map(() => new Array(y).fill(0)
                      .map(() => new Array(z).fill(0)));
}

function initializeSpace(plane, cycles) {
  // the space where active cubes reside can grow by at most 1 in any given direction per cycle
  // so if we add double the number of cycles to the starting dimensions we know we will never
  // need to expand our container or change our perspective.
  let xSize = plane.length + (cycles * 2);
  let ySize = plane[0].length + (cycles * 2);
  let zSize = 1 + (cycles * 2);

  const space = makeEmptySpace(xSize, ySize, zSize);

  // inset the starting plane so there's room to grow in every direction
  const startingPoint = cycles;

  for (let x = startingPoint; x < startingPoint + plane.length; x++) {
    for (let y = startingPoint; y < startingPoint + plane.length; y++) {
      space[x][y][startingPoint] = plane[x - startingPoint][y - startingPoint];
    }
  }

  return space;
}

function getVal(space, x, y, z) {
  // check bounds
  if (x < 0 || x >= space.length) return 0;
  if (y < 0 || y >= space[0].length) return 0;
  if (z < 0 || z >= space[0][0].length) return 0;

  return space[x][y][z];
}

function countImmediateNeighbors(space, x, y, z) {
  const offsets = [
                    [-1, -1, -1], [-1, -1,  0], [-1, -1,  1],
                    [-1,  0, -1], [-1,  0,  0], [-1,  0,  1],
                    [-1,  1, -1], [-1,  1,  0], [-1,  1,  1],
                    [ 0, -1, -1], [ 0, -1,  0], [ 0, -1,  1],
                    [ 0,  0, -1], /* SKIP 0 */  [ 0,  0,  1],
                    [ 0,  1, -1], [ 0,  1,  0], [ 0,  1,  1],
                    [ 1, -1, -1], [ 1, -1,  0], [ 1, -1,  1],
                    [ 1,  0, -1], [ 1,  0,  0], [ 1,  0,  1],
                    [ 1,  1, -1], [ 1,  1,  0], [ 1,  1,  1],
                  ];
  let count = 0;

  for (const [xDiff, yDiff, zDiff] of offsets) {
    count += getVal(space, x + xDiff, y + yDiff, z + zDiff);
  }

  return count;
}

function iterate(space) {
  let xSize = space.length;
  let ySize = space[0].length;
  let zSize = space[0][0].length;

  const nextIteration = makeEmptySpace(xSize, ySize, zSize);

  for (let x = 0; x < xSize; x++) {
    for (let y = 0; y < ySize; y++) {
      for (let z = 0; z < zSize; z++) {
        const count = countImmediateNeighbors(space, x, y, z);

        if (space[x][y][z] && (count === 2 || count === 3)) nextIteration[x][y][z] = 1;
        if (!space[x][y][z] && count === 3) nextIteration[x][y][z] = 1;
      }
    }
  }

  return nextIteration;
}

function countActiveCubes(space) {
  let xSize = space.length;
  let ySize = space[0].length;
  let zSize = space[0][0].length;

  let count = 0;

  for (let x = 0; x < xSize; x++) {
    for (let y = 0; y < ySize; y++) {
      for (let z = 0; z < zSize; z++) {
        if (space[x][y][z]) count++;
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

console.log("Part 1: ", countActiveCubes(spaceAfterNCycles(input, 6)));