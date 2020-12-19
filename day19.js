const fs = require('fs');

const [rulesInput, messagesInput] = fs.readFileSync(__dirname + '/inputs/day19.input', 'utf8').split('\n\n');

function parseRules(rulesBlob) {
  rulesBlob = rulesBlob.split('\n');

  const rulesMap = new Array(rulesBlob.length);

  for (const ruleString of rulesBlob) {
    const [index, rule] = ruleString.split(': ');
    rulesMap[index] = rule.split(' | ')
                          .map(option => {
                                return option.split(' ').map((member) => {
                                  if (isNaN(Number(member))) return member[1];
                                  return Number(member);
                                });
                              });
  }

  return rulesMap;
}

function parseMessages(messagesBlob) {
  return messagesBlob.split('\n')
}

function topologicalSort(rulesMap) {
  const referencedBy = new Array(rulesMap.length).fill(0).map(() => new Set());

  for (let i = 0; i < rulesMap.length; i++) {
    for (const neighbors of rulesMap[i]) {
      for (const neighbor of neighbors) {
        if (typeof neighbor !== 'string') referencedBy[neighbor].add(i);
      }
    }
  }

  const inDegree = new Array(rulesMap.length).fill(0);

  for (const rule of referencedBy) {
    rule.forEach(neighbor => {
      inDegree[neighbor]++;
    });
  }

  const queue = [];

  for (let rule = 0; rule < inDegree.length; rule++) {
    if (inDegree[rule] === 0) queue.push(rule);
  }

  const ordering = new Array(rulesMap.length).fill(0);
  let index = 0;

  while(queue.length) {
    const current = queue.shift();
    ordering[index] = current;
    index++;

    for (const neighbor of referencedBy[current]) {
      inDegree[neighbor]--;
      if (inDegree[neighbor] === 0) queue.push(neighbor);
    }
  }

  // can check index here to see if there was a loop in the rules
  //console.log("Do the rules have a loop? ", index !== rulesMap.length)
  return ordering;
}

function interpolate(targetRule, sourceNumber, sourceRules) {
  let branches = [[]];
  let prev = 0;
  let current = targetRule.indexOf(sourceNumber, prev);

  while (current !== -1) {
    branches = branches.map(branch => ([...branch, ...targetRule.slice(prev, current)]));

    const nextSegments = [];

    for (const initialSegment of branches) {
      for (const sourceSegment of sourceRules) {
        nextSegments.push([...initialSegment, ...sourceSegment]);
      }
    }

    branches = nextSegments;
    prev = current + 1;
    current = targetRule.indexOf(sourceNumber, prev);
  }

  branches = branches.map(branch => [...branch, ...targetRule.slice(prev)])
  return branches;
}

function getValidStrings(rulesMap) {
  const orderedRules = topologicalSort(rulesMap);

  for (const sourceRuleNumber of orderedRules) {
    for (let targetRuleNumber = 0; targetRuleNumber < rulesMap.length; targetRuleNumber++) {
      let newRule = [];

      for (const targetBranch of rulesMap[targetRuleNumber]) {
        newRule.push(...interpolate(targetBranch, sourceRuleNumber, rulesMap[sourceRuleNumber]));
      }

      rulesMap[targetRuleNumber] = newRule;
    }
  }

  return new Set(rulesMap[0].map(rule => rule.join('')));
}

function countValidMessages(validMessages, rawMessages) {
  return rawMessages.filter((message) => (validMessages.has(message))).length
}

console.log("Part 1: ", countValidMessages(getValidStrings(parseRules(rulesInput)), parseMessages(messagesInput)));