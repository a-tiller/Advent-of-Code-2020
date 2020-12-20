const fs = require('fs');

const input = fs.readFileSync(__dirname + '/inputs/day20.input', 'utf8').split('\n\n');

class Tile {
  constructor(id) {
    this.id = id;
    this.edges = [];
    this.matchedEdges = [];
    this.unmatchedSides = 0;
  }

  addEdge(encodedEdge) {
    let edge = 0;
    let reversedEdge = 0;

    for (let i = 0; i < encodedEdge.length; i++) {
      edge <<= 1;

      if (encodedEdge[i] === '#') {
        edge++;
        reversedEdge += 1 << i;
      }
    }

    this.edges.push(edge, reversedEdge)
    this.matchedEdges.push(false, false);
  }

  countUnmatched() {
    let unmatched = 0;
    for (let i = 0; i < this.matchedEdges.length; i += 2) {
      if(!this.matchedEdges[i] && !this.matchedEdges[i + 1]) unmatched++;
    }

    this.unmatchedSides = unmatched;
  }
}

function parseInput(tileBlobs) {
  const tiles = [];

  for (const tileBlob of tileBlobs) {
    const [label, tileString] = tileBlob.split(':\n');
    const [_, tileNumber] = label.split(' ');
    const tile = new Tile(Number(tileNumber));

    const tileMatrix = tileString.split('\n').map(row => row.split(''));
    const topEdge = tileMatrix[0];
    const bottomEdge = tileMatrix[tileMatrix.length - 1]
    const leftEdge = [];
    const rightEdge = [];

    for (const row of tileMatrix) {
      leftEdge.push(row[0]);
      rightEdge.push(row[row.length - 1]);
    }

    tile.addEdge(topEdge);
    tile.addEdge(rightEdge);
    tile.addEdge(bottomEdge);
    tile.addEdge(leftEdge);

    tiles.push(tile);
  }

  return tiles;
}

function setUnmatchedCount(tiles) {
  for (const tile of tiles) {
    tile.edges.forEach((edge, edgeNumber) => {
      for (const potentialMatch of tiles) {
        if (tile.id === potentialMatch.id) continue;

        if (potentialMatch.edges.includes(edge)) {
          tile.matchedEdges[edgeNumber] = true;
          break;
        }
      }
    });

    tile.countUnmatched();
  }
}

function multiplyCorners(tiles) {
  let product = 1;
  for (const tile of tiles) {
    if (tile.unmatchedSides === 2) product *= tile.id;
  }
  return product;
}

const tiles = parseInput(input);
setUnmatchedCount(tiles);

console.log("Part 1: ", multiplyCorners(tiles));
