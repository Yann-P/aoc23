import { expect, test } from 'vitest'
import { parseComplexLine } from './01'
import { getMinRequiredOfColorInSets, parseGameFromLine } from './02'

const testGames = `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`.split('\n').map(parseGameFromLine)

test('a', async () => {
  expect(getMinRequiredOfColorInSets(testGames[0].sets, 'red')).toBe(4)
  expect(getMinRequiredOfColorInSets(testGames[0].sets, 'green')).toBe(2)
  expect(getMinRequiredOfColorInSets(testGames[0].sets, 'blue')).toBe(6)
})
