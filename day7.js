const fs = require('fs');

const input = fs.readFileSync(__dirname + '/inputs/day7.input', 'utf8').split('\n');

function parseBagRules(rules) {
  const canBeContainedBy = {};
  const mustContain = {};

  for (const rule of rules) {
    const [container, contained] = rule.split('contain')

    const parent = container.match(/([a-z ]+) bag/)[1];
    const children = [...contained.matchAll(/(\d+) ([a-z ]+) bag/g)].map(result => [result[1], result[2]]);

    for (const child of children) {
      const [_, childName] = child;
      if (childName in canBeContainedBy) {
        canBeContainedBy[childName].push(parent);
        continue;
      }

      canBeContainedBy[childName] = [parent];
    }

    if (parent in mustContain) {
      mustContain[parent].push(...children);
    } else {
      mustContain[parent] = children;
    }
  }

  return [canBeContainedBy, mustContain];
}

const [containedByRules, containingRules] = parseBagRules(input);

function countPossibleContainers(rules, bagType) {
  const queue = [bagType];
  const possibleContainers = new Set();

  while (queue.length) {
    const current = queue.pop();

    if (current in rules) {
      const containingTypes = rules[current];
      for (const type of containingTypes) possibleContainers.add(type);
      queue.push(...containingTypes);
    }
  }

  return possibleContainers.size;
}

function topologicalSort(ruleset, bagList) {
  const outNodeCounts = {}
  const inNodeNames = {}

  for (const bagType of bagList) {
    if (!(bagType in ruleset)) {
      outNodeCounts[bagType] = 0;
      continue;
    }

    outNodeCounts[bagType] = ruleset[bagType].length;

    for (const [_, name] of ruleset[bagType]) {
      if (name in inNodeNames) inNodeNames[name].push(bagType)
      else inNodeNames[name] = [bagType];
    }
  }

  const queue = []

  for (const [bagType, count] of Object.entries(outNodeCounts)) {
    if (count === 0) queue.push(bagType);
  }

  const orderedList = [];

  while (queue.length) {
    const current = queue.pop();

    orderedList.push(current);

    if (!inNodeNames[current]) continue;

    for (const name of inNodeNames[current]) {
      outNodeCounts[name]--;
      if (outNodeCounts[name] === 0) queue.push(name);
    }
  }

  return orderedList;
}

function countBagsContained(rules, bagType) {
  const queue = [bagType];
  const bagList = new Set();

  while (queue.length) {
    const current = queue.pop();
    bagList.add(current);

    if (current in rules) {
      const containingTypes = rules[current];
      for (const [_, type] of containingTypes) {
        queue.push(type);
      }
    }
  }

  const sortedBagList = topologicalSort(rules, bagList);

  const bagCounts = {};

  for (const bag of sortedBagList) {
    let bagCount = 1;

    for (const [count, type] of rules[bag]){
      bagCount += count * bagCounts[type]
    }

    bagCounts[bag] = bagCount;
  }

  // subtract the single shiny gold bag
  return bagCounts[bagType] - 1;
}


console.log("Part 1: ", countPossibleContainers(containedByRules, 'shiny gold'));
console.log("Part 2: ", countBagsContained(containingRules, 'shiny gold'));