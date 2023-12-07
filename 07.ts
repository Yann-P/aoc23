import { countBy, sortBy } from "lodash";
import { loadInput } from "./util";

export type Card =
  | "A"
  | "K"
  | "Q"
  | "J"
  | "T"
  | "9"
  | "8"
  | "7"
  | "6"
  | "5"
  | "4"
  | "3"
  | "2";

const CARDS = ["A", "K", "Q", "J", "T", "9", "8", "7", "6", "5", "4", "3", "2"];

function scoreValue(value: Card) {
  return CARDS.length - CARDS.indexOf(value);
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

  score += scoreValue(hand[0]) * 13 ** 4;
  score += scoreValue(hand[1]) * 13 ** 3;
  score += scoreValue(hand[2]) * 13 ** 2;
  score += scoreValue(hand[3]) * 13 ** 1;
  score += scoreValue(hand[4]);

  return score;
}

export function isNOfAKind(hand: Card[], n: number) {
  const count = countBy(hand);
  const values = sortBy(Object.values(count));
  return values[values.length - 1] === n;
}

export function isFullHouse(hand: Card[]) {
  const count = countBy(hand);
  return (
    Object.keys(count).length === 2 && Object.values(count).some((v) => v === 3)
  );
}

export function isTwoPair(hand: Card[]) {
  const count = countBy(hand);
  const values = sortBy(Object.values(count));
  return Object.keys(count).length === 3 && values[1] === 2 && values[2] === 2;
}

export function isOnePair(hand: Card[]) {
  const count = countBy(hand);
  return (
    Object.keys(count).length === 4 && Object.values(count).some((v) => v === 2)
  );
}

export function isHighCard(hand: Card[]) {
  const count = countBy(hand);
  return Object.keys(count).length === 5;
}

async function process(inp: string) {
  const input = inp
    .split("\n")
    .filter(Boolean)
    .map((l) => [l.split(" ")[0], Number(l.split(" ")[1])] as [string, number]);

  const hands = input.map(([hand, bid]) => hand.split("") as Card[]);

  const ranks = [...hands]
    .sort((a, b) => scoreHand(a) - scoreHand(b))
    .map((h) => h.join(""));

  // for (const [i, rank] of ranks.entries()) {
  //   console.log(i + 1, rank, scoreHand(rank.split("") as Card[]));
  // }

  return input.reduce((acc, [hand, bid]) => {
    if (ranks.indexOf(hand) < 0) {
      throw new Error("ah");
    }
    // console.log(
    //   hand,
    //   ranks.indexOf(hand) + 1,
    //   bid,
    //   scoreHand(hand.split("") as Card[])
    // );
    return acc + bid * (ranks.indexOf(hand) + 1);
  }, 0);
}

Promise.all([
  process(`32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483`),
  loadInput("07").then((v) => process(v)),
]).then(console.log);
