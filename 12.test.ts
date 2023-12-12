import { expect, test } from "vitest";
import {
  buildNextNodes,
  computeTotalCombinations,
  findWindowPositions,
  isSequenceValid,
  placeGroupAndPadWithZeros,
} from "./12";

const testSeq1 = "?#???.#????#??.".split("");

test("findWindowPositions", () => {
  expect(findWindowPositions(testSeq1, 4)).toEqual([0, 1, 6, 8, 9, 10]);
  expect(findWindowPositions("???.###".split(""), 3)).toEqual([0, 4]);
});

test("placeGroupAndPadWithZeros", () => {
  expect(placeGroupAndPadWithZeros(testSeq1, 1, 4)).toEqual(
    ".####.#????#??.".split("")
  );
  expect(placeGroupAndPadWithZeros(testSeq1, 8, 4)).toEqual(
    "?#???.#.####.?.".split("")
  );
});

test("buildNextNodes", () => {
  expect(
    buildNextNodes({
      sequence: testSeq1,
      groupsToFind: [3, 1, 1, 4],
      path: [],
    }).slice(0, 1)
  ).toEqual([
    {
      sequence: "####..#????#??.".split(""),
      groupsToFind: [3, 1, 1],
      path: [0],
    },
  ]);
});

test("isSequenceValid", () => {
  expect(isSequenceValid(".###.##.#...".split(""), [3, 2, 1])).toBe(true);
  expect(isSequenceValid(".###.##..#..".split(""), [3, 2, 1])).toBe(true);
  expect(isSequenceValid(".###.##...#.".split(""), [3, 2, 1])).toBe(true);
  expect(isSequenceValid(".###.##....#".split(""), [3, 2, 1])).toBe(true);
  expect(isSequenceValid(".###..##.#..".split(""), [3, 2, 1])).toBe(true);
  expect(isSequenceValid(".###..##..#.".split(""), [3, 2, 1])).toBe(true);
  expect(isSequenceValid(".###..##...#".split(""), [3, 2, 1])).toBe(true);
  expect(isSequenceValid(".###...##.#.".split(""), [3, 2, 1])).toBe(true);
  expect(isSequenceValid(".###...##..#".split(""), [3, 2, 1])).toBe(true);
  expect(isSequenceValid(".###....##.#".split(""), [3, 2, 1])).toBe(true);

  expect(isSequenceValid(".##.##.#...".split(""), [3, 2, 1])).toBe(false);
  expect(isSequenceValid(".###.#..#..".split(""), [3, 2, 1])).toBe(false);
  expect(isSequenceValid(".###.##.....".split(""), [3, 2, 1])).toBe(false);
  expect(isSequenceValid(".###.##...##".split(""), [3, 2, 1])).toBe(false);
  expect(isSequenceValid(".###..##....".split(""), [3, 2, 1])).toBe(false);
  expect(isSequenceValid(".#######..#.".split(""), [3, 2, 1])).toBe(false);
  expect(isSequenceValid("......##...#".split(""), [3, 2, 1])).toBe(false);
  expect(isSequenceValid(".##...###.#.".split(""), [3, 2, 1])).toBe(false);
  expect(isSequenceValid(".###.#.##.##".split(""), [3, 2, 1])).toBe(false);
  expect(isSequenceValid("####.#.###.#".split(""), [3, 2, 1])).toBe(false);
});

test("computeTotalCombinations", () => {
  expect(
    computeTotalCombinations({
      sequence: "???.###".split(""),
      groupsToFind: [1, 1, 3],
      path: [],
    })
  ).toBe(1);
});

test("computeTotalCombinations 2", () => {
  expect(
    computeTotalCombinations({
      sequence: "?#?#?#?#?#?#?#?".split(""),
      groupsToFind: [1, 3, 1, 6],
      path: [],
    })
  ).toBe(1);
});

test("computeTotalCombinations 3", () => {
  expect(
    computeTotalCombinations({
      sequence: "?###????????".split(""),
      groupsToFind: [3, 2, 1],
      path: [],
    })
  ).toBe(10);
});

test("computeTotalCombinations 4", () => {
  expect(
    computeTotalCombinations({
      sequence: "????.######..#####.".split(""),
      groupsToFind: [1, 6, 5],
      path: [],
    })
  ).toBe(4);
});

test("computeTotalCombinations 5", () => {
  expect(
    computeTotalCombinations({
      sequence: "????.#...#...".split(""),
      groupsToFind: [4, 1, 1],
      path: [],
    })
  ).toBe(1);
});
