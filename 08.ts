import { range } from "lodash";
import { loadInputAsArray } from "./util";
import lcm from "lcm";

const sampleInput = `LR
11A = (11B, XXX)
11B = (XXX, 11Z)
11Z = (11B, XXX)
22A = (22B, XXX)
22B = (22C, 22C)
22C = (22Z, 22Z)
22Z = (22B, 22B)
XXX = (XXX, XXX)`;

function parseMap(input: string[]) {
  return input.reduce(
    (acc, line) => {
      const [source, other] = line.replaceAll(" ", "").split("=");
      const [left, right] = other
        .replaceAll("(", "")
        .replaceAll(")", "")
        .split(",");
      acc[source] = [left, right];
      return acc;
    },
    {} as Record<string, [string, string]>
  );
}

async function part1() {
  const input = await loadInputAsArray("08");

  const [instructionsAsText, ...mapAsText] = input;
  const instructions = instructionsAsText.split("");
  const map = parseMap(mapAsText);

  let currentPosition = "AAA";
  let reachedDestination = false;
  let i = 0;

  while (!reachedDestination) {
    const instruction = instructions[i % instructions.length];

    currentPosition = map[currentPosition][instruction === "L" ? 0 : 1];
    reachedDestination = currentPosition === "ZZZ";

    i++;
  }

  return i;
}

async function part2() {
  const input = await loadInputAsArray("08");

  const [instructionsAsText, ...mapAsText] = input;
  const instructions = instructionsAsText.split("");
  const map = parseMap(mapAsText);

  let currentPositions = Object.keys(map).filter((key) => key.endsWith("A"));

  const cycleLengths = currentPositions.map((currentPosition) => {
    let i = 0;
    let reachedDestination = false;

    while (!reachedDestination) {
      const instruction = instructions[i % instructions.length];

      currentPosition = map[currentPosition][instruction === "L" ? 0 : 1];
      reachedDestination = currentPosition.endsWith("Z");

      i++;
    }
    return i;
  });

  return cycleLengths.reduce((acc, val) => lcm(acc, val), 1);
}

Promise.all([part1(), part2()]).then(console.log);
