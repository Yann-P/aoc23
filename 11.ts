import { range, sum } from "lodash";
import { loadInputAsArray } from "./util";

const sampleInput = `...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#.....`;

function printMap(map: Readonly<string[][]>) {
  console.log(map.map((row) => row.join("")).join("\n"));
}

function expandUniverse(universe: Readonly<string[][]>, n = 1) {
  const newUniverse = [...universe];

  const nRows = universe.length;
  const nCols = universe[0].length;

  const insertColumn = (col: number) =>
    newUniverse.forEach((row) => {
      row.splice(col, 0, ...Array.from({ length: n }, () => "."));
    });

  const insertRow = (row: number) =>
    newUniverse.splice(
      row,
      0,
      ...Array.from({ length: n }, () =>
        new Array(universe[0].length).fill(".")
      )
    );

  const columnsWithoutGalaxies = range(0, nCols).filter((col) =>
    range(0, nRows).every((row) => universe[row][col] === ".")
  );
  const rowsWithoutGalaxies = range(0, nRows).filter((row) =>
    range(0, nCols).every((col) => universe[row][col] === ".")
  );

  columnsWithoutGalaxies.forEach((col, delta) => insertColumn(col + delta * n));
  rowsWithoutGalaxies.forEach((row, delta) => insertRow(row + delta * n));

  return newUniverse;
}

async function part1() {
  const rawInput = await loadInputAsArray("11");
  //const rawInput = sampleInput.split("\n");

  const input = expandUniverse(
    rawInput.map((line) => line.split("")),
    1
  );

  const galaxies = input.reduce(
    (acc, line, row) => {
      line.forEach((symbol, col) => {
        if (symbol === "#") {
          acc.push([col, row]);
        }
      });
      return acc;
    },
    [] as [number, number][]
  );

  const n = galaxies.length;

  const pairs = range(0, n)
    .map((i) => range(i, n).map((j) => [i, j]))
    .flat();

  const distances = pairs.map(([g1, g2]) => {
    const [g1x, g1y] = galaxies[g1];
    const [g2x, g2y] = galaxies[g2];
    const dist = Math.abs(g1x - g2x) + Math.abs(g1y - g2y);
    return dist;
  });

  return sum(distances);
}

async function part2() {
  const rawInput = await loadInputAsArray("11");
  //const rawInput = sampleInput.split("\n");

  const input = rawInput.map((line) => line.split(""));

  const nRows = input.length;
  const nCols = input[0].length;

  const columnsWithoutGalaxies = range(0, nCols).filter((col) =>
    range(0, nRows).every((row) => input[row][col] === ".")
  );
  const rowsWithoutGalaxies = range(0, nRows).filter((row) =>
    range(0, nCols).every((col) => input[row][col] === ".")
  );

  const galaxies = input.reduce(
    (acc, line, row) => {
      line.forEach((symbol, col) => {
        if (symbol === "#") {
          const nColsWithoutGalaxiesBefore = columnsWithoutGalaxies.filter(
            (i) => i < col
          ).length;
          const nRowsWithoutGalaxiesBefore = rowsWithoutGalaxies.filter(
            (i) => i < row
          ).length;

          acc.push([
            col + nColsWithoutGalaxiesBefore * (1e6 - 1),
            row + nRowsWithoutGalaxiesBefore * (1e6 - 1),
          ]);
        }
      });
      return acc;
    },
    [] as [number, number][]
  );

  const n = galaxies.length;

  const pairs = range(0, n)
    .map((i) => range(i, n).map((j) => [i, j]))
    .flat();

  const distances = pairs.map(([g1, g2]) => {
    const [g1x, g1y] = galaxies[g1];
    const [g2x, g2y] = galaxies[g2];
    const dist = Math.abs(g1x - g2x) + Math.abs(g1y - g2y);
    return dist;
  });

  return sum(distances);
}

Promise.all([part1(), part2()]).then(console.log);
