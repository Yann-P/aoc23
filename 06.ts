import { zip } from "lodash";
/// @ts-ignore
import binarySearch from "binary-search";

function calcDist(pushTime: number, raceTime: number) {
  return Math.max(0, raceTime - pushTime) * pushTime;
}

async function part1() {
  const inputTimes = [63, 78, 94, 68];
  const inputDistances = [411, 1274, 2047, 1035];
  const input = zip(inputTimes, inputDistances) as number[][];

  return input.reduce((acc, [allowedTime, bestDistance]) => {
    const winningPushTimes = new Set();
    for (let pushTime = 1; pushTime <= allowedTime; pushTime++) {
      const res = calcDist(pushTime, allowedTime);
      if (res > bestDistance) {
        winningPushTimes.add(pushTime);
      }
    }

    return acc * winningPushTimes.size;
  }, 1);
}

async function part2() {
  const [allowedTime, bestDistance] = [63789468, 411127420471035];

  const winningPushTimes: number[] = [];
  for (let pushTime = 1; pushTime <= allowedTime; pushTime++) {
    const distance = calcDist(pushTime, allowedTime);
    if (
      distance > bestDistance &&
      binarySearch(
        winningPushTimes,
        pushTime,
        (a: number, b: number) => a - b
      ) <= 0
    ) {
      winningPushTimes.push(pushTime);
    }
  }

  return winningPushTimes.length;
}

Promise.all([part1(), part2()]).then(console.log);
