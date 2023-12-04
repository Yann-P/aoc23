import { intersection, range } from "lodash";
import { loadInputAsArray } from "./util";

type Card = {
  id: number;
  winning: number[];
  own: number[];
}

function parseCards(input: string[]): Card[] {
  return input.map((line, i) => {
    const [winning, own] = line
      .replace(/Card \d+: +/, '')
      .split('|')
      .map(side => side
        .split(/ +/)
        .filter(Boolean)
        .map(Number)
      );

    return {
      id: i + 1,
      winning,
      own
    }
  })
}

function getCardPoints(card: Card): { matches: number; score: number } {
  const matches = intersection(card.winning, card.own).length
  return {
    score: matches !== 0 ? 2 ** (matches - 1) : 0,
    matches: matches
  }
}

async function part1() {
  const input = await loadInputAsArray("04");
  return parseCards(input).reduce((total, card) => total + getCardPoints(card).score, 0)
}

async function part2() {
  const input = await loadInputAsArray("04");
  const stack = parseCards(input);
  let counter = 0;
  while (stack.length) {
    const currentCard = stack.shift()!;
    const matches = getCardPoints(currentCard).matches;
    const cardsToAdd = range(currentCard.id + 1, currentCard.id + 1 + matches).map(cardId => ({
      ...stack.find(card => card.id === cardId)
    } as Card))
    stack.splice(1, 0, ...cardsToAdd); // add at index 1
    counter++;
  }
  return counter;
}


Promise.all([part1(), part2()]).then(console.log)
