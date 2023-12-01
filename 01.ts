import { loadInputAsArray } from "./util";

function parseSimpleLine(line: string) {
  const matches = line.match(/([0-9])/g);
  if (!matches?.length) {
    return 0
  }
  return +matches[0] * 10 + +matches[matches.length - 1]!
}

export function parseComplexLine(line: string) {
  const mapping = {
    'one': 1,
    'two': 2,
    'three': 3,
    'four': 4,
    'five': 5,
    'six': 6,
    'seven': 7,
    'eight': 8,
    'nine': 9
  };

  const numberWords = Object.keys(mapping);

  const regex = new RegExp([...numberWords, '\\d'].join('|'), 'g')

  let next = regex.exec(line);
  const matches: string[] = [];

  while (next) {
    matches.push(next[0]);
    regex.lastIndex = next.index + 1;
    next = regex.exec(line);
  }

  if (!matches) {
    return 0;
  }

  const matchToNumber = (match: string) => +match ? +match : mapping[match as keyof typeof mapping];
  return matchToNumber(matches[0]!) * 10 + matchToNumber(matches[matches.length - 1]!);
}

export async function part1() {
  const input = await loadInputAsArray("01");
  return input.reduce((acc, line) => acc + parseSimpleLine(line), 0)
}

export async function part2() {
  const input = await loadInputAsArray("01");
  return input.reduce((acc, line) => acc + parseComplexLine(line), 0)
}


Promise.all([part1(), part2()]).then(console.log)
