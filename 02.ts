import { loadInputAsArray } from "./util";

type Set = {
  [color: string]: number;
}

type Game = {
  id: number;
  sets: Set[];
}

export function parseGameFromLine(line: string): Game {
  const [_, gameId, sets] = Array.from(line.match(/Game (\d+):(.+)/) as any) as string[];

  return {
    id: +gameId,
    sets: sets.split(';').map(set => {
      const colorAmounts = set.split(',');
      return colorAmounts.reduce((acc, colorAmount) => {
        const [amount, color] = colorAmount.trim().split(' ');
        acc[color] = Number(amount);
        return acc;
      }, {} as Set)
    })
  }
}

function getMaxOfColorInSets(sets: Set[], color: string) {
  return Math.max(...sets.map(set => set[color] ?? 0))
}

export function getMinRequiredOfColorInSets(sets: Set[], color: string) {
  return Math.max(...sets.map(set => set[color]).filter(val => val !== undefined))
}

function isGamePossible(totalCubes: Set, game: Game) {
  return Object.keys(totalCubes).every(colorToTest => {
    return getMaxOfColorInSets(game.sets, colorToTest) <= totalCubes[colorToTest]
  })
}

export async function part1() {
  const input = await loadInputAsArray("02");
  const games = input.map(parseGameFromLine)
  return games.reduce((acc, game) => acc + (isGamePossible({
    'red': 12,
    'green': 13,
    'blue': 14
  }, game) ? game.id : 0), 0)
}

export async function part2() {
  const input = await loadInputAsArray("02");
  const games = input.map(parseGameFromLine)
  return games.reduce((totalOfPowers, game) => {
    const power = ["red", "green", "blue"].reduce((power, colorToTest) => {
      return power * getMinRequiredOfColorInSets(game.sets, colorToTest);
    }, 1)
    return totalOfPowers + power;
  }, 0)
}

Promise.all([part1(), part2()]).then(console.log)
