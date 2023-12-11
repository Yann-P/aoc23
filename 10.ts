import { isEqual } from "lodash";
import { loadInputAsArray } from "./util";

type MazeSymbol = "" | "." | "-" | "|" | "S" | "L" | "J" | "7" | "F";

const sampleInput = `.....
.S-7.
.|.|.
.L-J.
.....`;

const sampleInput2 = `..F7.
.FJ|.
SJ.L7
|F--J
LJ...`;

const sampleInputLoop = `...........
.S-------7.
.|F-----7|.
.||.....||.
.||.....||.
.|L-7.F-J|.
.|..|.|..|.
.L--J.L--J.
...........`;

const sampleInputLoop2 = `FF7FSF7F7F7F7F7F---7
L|LJ||||||||||||F--J
FL-7LJLJ||||||LJL-77
F--JF--7||LJLJ7F7FJ-
L---JF-JLJ.||-FJLJJ7
|F|F-JF---7F7-L7L|7|
|FFJF7L7F-JF7|JL---7
7-L-JL7||F7|L7F-7F7|
L.L7LFJ|||||FJL7||LJ
L7JLJL-JLJLJL--JLJ.L`;

function isValidNextMove(
  direction: [number, number],
  prevSymbol: MazeSymbol,
  nextSymbol: MazeSymbol
) {
  if (isEqual(direction, [1, 0]) && ["|", "7", "J"].includes(prevSymbol)) {
    return false;
  }

  if (isEqual(direction, [-1, 0]) && ["|", "F", "L"].includes(prevSymbol)) {
    return false;
  }

  if (isEqual(direction, [0, 1]) && ["-", "L", "J"].includes(prevSymbol)) {
    return false;
  }

  if (isEqual(direction, [0, -1]) && ["-", "7", "F"].includes(prevSymbol)) {
    return false;
  }

  return (
    (isEqual(direction, [1, 0]) && ["-", "J", "7"].includes(nextSymbol)) ||
    (isEqual(direction, [-1, 0]) && ["-", "F", "L"].includes(nextSymbol)) ||
    (isEqual(direction, [0, 1]) && ["|", "L", "J"].includes(nextSymbol)) ||
    (isEqual(direction, [0, -1]) && ["|", "F", "7"].includes(nextSymbol))
  );
}

function getNeighbors(input: MazeSymbol[][], x: number, y: number) {
  return [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ].reduce(
    (acc, [dx, dy]) => {
      const symbol = input[y + dy]?.[x + dx];
      if (symbol !== undefined && symbol !== ".") {
        acc.push([dx, dy]);
      }
      return acc;
    },
    [] as [number, number][]
  );
}

function walkPath(input: MazeSymbol[][], xStart: number, yStart: number) {
  let current: [number, number] = [xStart, yStart];
  let visited = new Set();
  const markVisited = (pos: [number, number]) => visited.add(pos.join(","));
  const hasVisited = (pos: [number, number]) => visited.has(pos.join(","));

  while (!hasVisited(current)) {
    console.log("# visiting", current, input[current[1]][current[0]]);
    markVisited(current);
    const neighbors = getNeighbors(input, ...current);

    const nextValidMoves = neighbors
      .map(([dx, dy]) => [dx + current[0], dy + current[1]] as [number, number])
      .filter((nextPosition, i) => {
        const [dx, dy] = neighbors[i];
        // console.log(
        //   "### nextPosition",
        //   nextPosition,
        //   input[nextPosition[1]][nextPosition[0]],
        // );
        return (
          isValidNextMove(
            [dx, dy],
            input[current[1]][current[0]],
            input[nextPosition[1]][nextPosition[0]]
          ) && !hasVisited(nextPosition)
        );
      });

    //console.log("## nextValidMoves", nextValidMoves);

    if (nextValidMoves.length === 0) {
      console.warn("No valid moves");
      break;
    }

    const pickedMove = nextValidMoves[0];
    console.log("moving", [
      pickedMove[0] - current[0],
      pickedMove[1] - current[1],
    ]);
    current = pickedMove;
  }

  return {
    hasVisited,
    size: visited.size,
    visited,
  };
}

async function part1() {
  const rawInput = await loadInputAsArray("10");
  //const rawInput = sampleInput.split("\n");

  const input = rawInput.map((l) => l.split("") as MazeSymbol[]);

  const yS = input.findIndex((line) => line.includes("S"));
  const xS = input[yS].indexOf("S");

  return walkPath(input, xS, yS).size / 2;
}

function isInside(
  input: MazeSymbol[][],
  isPartOfMainLoop: (x: number, y: number) => boolean,
  destX: number,
  destY: number
) {
  const line = input[destY].join("");

  const cleanedLine = line
    .split("")
    .map((symbol, x) => (isPartOfMainLoop(x, destY) ? symbol : " "))
    .join("")
    .replaceAll("S", "|")
    .replaceAll("-", " ")
    .replaceAll("LJ", "  ")
    .replaceAll("F7", "  ")
    .replaceAll("FJ", "| ")
    .replaceAll("L7", "| ")
    .replaceAll("L", "|")
    .replaceAll("J", "|");

  console.log("cleanedLine", cleanedLine);
  const charactersUpToDestination = cleanedLine.slice(0, destX);
  console.log("charactersUpToDestination", charactersUpToDestination);
  return (charactersUpToDestination.match(/\|/g) ?? []).length;
}

async function part2() {
  //const rawInput = sampleInputLoop2.split("\n");
  const rawInput = await loadInputAsArray("10");

  const input = rawInput.map((l) => l.split("") as MazeSymbol[]);

  const yS = input.findIndex((line) => line.includes("S"));
  const xS = input[yS].indexOf("S");

  const walk = walkPath(input, xS, yS);

  let nInside = 0;

  console.log(
    input
      .map((line, y) => {
        return line
          .map((symbol, x) => {
            const res = isInside(
              input,
              (xx, yy) => walk.hasVisited([xx, yy]),
              x,
              y
            );
            const inside = res % 2 == 1 ? "I" : "O";
            const isJunkSymbol = !walk.hasVisited([x, y]) && symbol !== ".";
            if (res % 2 == 1 && (symbol === "." || isJunkSymbol)) {
              nInside++;
            }
            return symbol === "." ? inside : symbol;
          })
          .join("");
      })
      .join("\n")
  );

  return nInside;
}

Promise.all([part2()]).then(console.log);
