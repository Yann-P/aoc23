import { last } from "lodash";
import { loadInputAsArray } from "./util";

const sampleInput = `0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45`;

function sumToZero(line: number[]) {
  const history: number[][] = [line];

  while (last(history)!.some((v) => v !== 0)) {
    const prevLine = last(history)!,
      newLine = [];
    for (let i = 1; i < prevLine.length; i++) {
      newLine.push(prevLine[i] - prevLine[i - 1]);
    }
    history.push(newLine);
  }
  return history;
}

async function part1() {
  const input = (await loadInputAsArray("09")).map((line) =>
    line.split(" ").map(Number)
  );

  // const input = sampleInput
  //   .split("\n")
  //   .map((line) => line.split(" ").map(Number));

  return input.reduce((sum, line) => {
    const history = sumToZero(line);

    last(history)!.push(0);
    for (let i = history.length - 2; i >= 0; i--) {
      history[i].push(last(history[i])! + last(history[i + 1])!);
    }

    return sum + last(history[0])!;
  }, 0);
}

async function part2() {
  const input = (await loadInputAsArray("09")).map((line) =>
    line.split(" ").map(Number)
  );

  return input.reduce((sum, line) => {
    const history = sumToZero(line);

    last(history)!.unshift(0);
    for (let i = history.length - 2; i >= 0; i--) {
      history[i].unshift(history[i][0] - history[i + 1][0]);
    }

    return sum + history[0][0];
  }, 0);
}

Promise.all([part1(), part2()]).then(console.log);
