import { expect, test } from 'vitest'
import { getSumOfEngineNumbers } from './03'
import { loadInputAsArray } from './util';

const testInput = `467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..`;

test('3', async () => {
  const input = testInput.split('\n');
  expect(getSumOfEngineNumbers(input)).toBe(4361);
})
