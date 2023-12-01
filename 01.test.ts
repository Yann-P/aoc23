import { expect, test } from 'vitest'
import { parseComplexLine } from './01'

test('parseComplexLine', async () => {
  expect(parseComplexLine('two1nine')).toBe(29)
  expect(parseComplexLine('eightwothree')).toBe(83)
  expect(parseComplexLine('treb7uchet')).toBe(77)
  expect(parseComplexLine('zoneight234')).toBe(14)
  expect(parseComplexLine('7pqrstsixteen')).toBe(76)
  expect(parseComplexLine('eightwo')).toBe(82)

})
