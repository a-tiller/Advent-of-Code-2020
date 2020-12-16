const fs = require('fs');

const input = fs.readFileSync(__dirname + '/inputs/day16.input', 'utf8').split('\n\n');

function parseInput([fieldBlob, yourTicketBlob, nearbyTicketBlob]) {
  const fields = {};

  fieldBlob.split('\n')
            .forEach(labelRangePair => {
              const [label, rangeString] = labelRangePair.split(': ');
              const ranges = rangeString.split(' or ');
              const [min0, max0] = ranges[0].split('-').map(Number);
              const [min1, max1] = ranges[1].split('-').map(Number);
              fields[label] = (val) => ((val >= min0 && val <= max0) || (val >= min1 && val <= max1));
            });

  const yourTickets = yourTicketBlob.split('\n')
                                    .slice(1)
                                    .map((ticketRow) => (ticketRow.split(',').map(Number)))[0];

  const nearbyTickets = nearbyTicketBlob.split('\n')
                                        .slice(1)
                                        .map((ticketRow) => (ticketRow.split(',').map(Number)));

  return {fields, yourTickets, nearbyTickets};
}

function ticketScanningErrorRate({ fields, nearbyTickets }) {
  let rate = 0;

  const tests = Object.values(fields);

  for (const ticket of nearbyTickets) {
    for (const value of ticket) {
      let valid = false;

      for (const test of tests) {
        if (test(value)) {
          valid = true;
          break;
        }
      }

      if (!valid) rate += value;
    }
  }

  return rate;
}

function filterTickets(tickets, fields) {
  const isValidTicket = (ticket, tests) => {
    for (const value of ticket) {
      let valid = false;

      for (const test of tests) {
        if (test(value)) {
          valid = true;
          break;
        }
      }

      if (!valid) return false;
    }

    return true;
  }

  const tests = Object.values(fields);

  return tickets.filter(ticket => isValidTicket(ticket, tests));
}

function getLabels(tests, tickets) {
  const potential = new Array(tickets[0].length).fill(0).map(() => new Set(Object.keys(tests)));
  const final = new Array(tickets[0].length).fill(null);

  // for each ticket slot, remove any field that any ticket fails the test for
  for (const ticket of tickets) {
    ticket.forEach((value, index) => {
      potential[index].forEach((label) => {
        if (!tests[label](value)) {
          potential[index].delete(label);
        }
      })
    });
  }

  let keepLooping = true;

  // if any field has only one candidate, assign it and remove from other lists.
  while(keepLooping) {
    keepLooping = false;

    potential.forEach((list, index) => {
      if (list.size === 1) {
        const label = [...list][0];
        final[index] = label;

        for (const member of potential) {
          member.delete(label);
        }
        keepLooping = true;
      }
    })
  }

  return final;
}

function startsWithDeparture(label) {
  return label.split(' ')[0] === 'departure';
}

function findProduct({ fields, yourTickets, nearbyTickets }, isMultiplicand) {
  const filteredTickets = filterTickets(nearbyTickets, fields);

  const orderedLabels = getLabels(fields, filteredTickets);

  return yourTickets.filter((_, i) => (isMultiplicand(orderedLabels[i]))).reduce((a, b) => (a * b), 1);
}

console.log('Part 1: ', ticketScanningErrorRate(parseInput(input)));
console.log('Part 2: ', findProduct(parseInput(input), startsWithDeparture));

