import { chunk, countBy, groupBy, orderBy, sortBy } from "lodash";
import { loadInput } from "./util";
import {
  isNOfAKind,
  isFullHouse,
  isTwoPair,
  isOnePair,
  isHighCard,
  Card,
} from "./07";

type Hand = Card[];

const NON_JOKER_CARDS: Card[] = [
  "A",
  "K",
  "Q",
  "T",
  "9",
  "8",
  "7",
  "6",
  "5",
  "4",
  "3",
  "2",
];

const CARDS = ["A", "K", "Q", "T", "9", "8", "7", "6", "5", "4", "3", "2", "J"];

function scoreValue(value: Card) {
  return CARDS.length - CARDS.indexOf(value);
}

function getHandsForJoker(
  hands: Hand[],
  indexesOfJokers: number[],
  i = 0
): Hand[] {
  const res = [...hands];

  if (i >= indexesOfJokers.length) {
    return res;
  }

  for (const hand of hands) {
    for (const card of NON_JOKER_CARDS) {
      const newHand = [...hand];
      newHand[indexesOfJokers[i]] = card;
      res.push(newHand);
    }
  }

  return getHandsForJoker(res, indexesOfJokers, i + 1);
}

function scoreHandWithJokers(hand: Card[]) {
  const allPossibleHands = getHandsForJoker(
    [hand],
    hand.reduce((acc, card, i) => {
      if (card === "J") {
        acc.push(i);
      }
      return acc;
    }, [] as number[])
  );

  let max = -Infinity;
  for (const possibleHand of allPossibleHands) {
    const score = scoreHand(possibleHand);
    if (score > max) {
      max = score;
    }
  }

  max += scoreValue(hand[0]) * 13 ** 4;
  max += scoreValue(hand[1]) * 13 ** 3;
  max += scoreValue(hand[2]) * 13 ** 2;
  max += scoreValue(hand[3]) * 13 ** 1;
  max += scoreValue(hand[4]);

  return max;
}

function scoreHand(hand: Card[]) {
  if (hand.length !== 5) throw new Error("Invalid hand");

  let score = 0;

  if (isNOfAKind(hand, 5)) {
    score += 13 ** 11;
  }
  if (isNOfAKind(hand, 4)) {
    score += 13 ** 10;
  }
  if (isFullHouse(hand)) {
    score += 13 ** 9;
  }
  if (isNOfAKind(hand, 3)) {
    score += 13 ** 8;
  }
  if (isTwoPair(hand)) {
    score += 13 ** 7;
  }
  if (isOnePair(hand)) {
    score += 13 ** 6;
  }
  if (isHighCard(hand)) {
    score += 13 ** 5;
  }

  return score;
}

async function process() {
  const input = (await loadInput("07"))
    .split("\n")
    .filter(Boolean)
    .map((l) => [l.split(" ")[0], Number(l.split(" ")[1])] as [string, number]);

  const hands = input.map(([hand, bid]) => hand.split("") as Card[]);

  const ranks = [...hands]
    .sort((a, b) => scoreHandWithJokers(a) - scoreHandWithJokers(b))
    .map((h) => h.join(""));

  return input.reduce((acc, [hand, bid]) => {
    if (ranks.indexOf(hand) < 0) {
      throw new Error("ah");
    }
    return acc + bid * (ranks.indexOf(hand) + 1);
  }, 0);
}

Promise.all([process()]).then(console.log);
