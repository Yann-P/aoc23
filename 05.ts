import { chunk } from "lodash";
import { loadInput } from "./util";

type IntervalMap = {
  srcStart: number;
  destStart: number;
  range: number;
};

function parseSeedsFromInput(input: string): number[] {
  return input.split("\n")[0].split(": ")[1].split(" ").map(Number);
}

function parseIntervalMapsFromInput(input: string): IntervalMap[][] {
  const [_, ...sections] = input.split("\n\n");

  return sections.map((section) => {
    const [_, ...intervals] = section.split("\n");
    return intervals.map((interval) => {
      const [destStart, srcStart, range] = interval.split(" ").map(Number);
      return { srcStart, destStart, range };
    });
  });
}

function intervalMapper({ srcStart, destStart, range }: IntervalMap) {
  const srcEnd = srcStart + range - 1;
  return function (query: number) {
    if (query < srcStart || query > srcEnd) return undefined;
    const offset = query - srcStart;
    return destStart + offset;
  };
}

function intervalsMapper(intervals: IntervalMap[]) {
  const mappers = intervals.map((interval) => intervalMapper(interval));
  return function (query: number) {
    for (const mapper of mappers) {
      const res = mapper(query);
      if (res !== undefined) {
        return res;
      }
    }
    return query;
  };
}

function seedToLocation(seed: number, intervalSections: IntervalMap[][]) {
  let value = seed;
  for (const intervals of intervalSections) {
    value = intervalsMapper(intervals)(value);
  }
  return value;
}

async function part1() {
  const input = await loadInput("05");

  const seeds = parseSeedsFromInput(input);
  const intervals = parseIntervalMapsFromInput(input);

  return Math.min(...seeds.map((seed) => seedToLocation(seed, intervals)));
}

async function part2() {
  const input = await loadInput("05");

  const rawSeeds = parseSeedsFromInput(input);
  const seedRanges = chunk(rawSeeds, 2).map(([start, end]) => [
    start,
    start + end - 1,
  ]);

  const intervals = parseIntervalMapsFromInput(input);

  let min = Infinity;
  let res;
  let i = 0;

  for (const [start, end] of seedRanges) {
    for (let seed = start; seed <= end; seed++) {
      if (i % 100000 === 0) console.log((i / 2327072676) * 100, "%");
      res = seedToLocation(seed, intervals);
      if (res < min) {
        min = res;
      }
      i++;
    }
  }
  return min;
}

Promise.all([part1(), part2()]).then(console.log);
