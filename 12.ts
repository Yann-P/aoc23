import chalk from "chalk";
import { last, orderBy, pull, sortBy, uniq, zip } from "lodash";
import { loadInputAsArray } from "./util";

type Sequence = string[];

type Node = {
  groupsToFind: number[];
  sequence: Sequence;
  path: number[];
};

export function findWindowPositions(sequence: Sequence, windowSize: number) {
  // 0 0 0 _ _ _ _ 1 1

  // find contiguous _s or 1s of size windowSize

  const positions: number[] = [];
  for (let i = 0; i <= sequence.length - windowSize; i++) {
    const window = sequence.slice(i, i + windowSize);
    if (window.every((x) => x === "#" || x === "?")) {
      if (sequence[i - 1] === "#" || sequence[i + windowSize] === "#") {
        continue;
      }
      positions.push(i);
    }
  }

  return positions;
}

export function placeGroupAndPadWithZeros(
  sequence: Readonly<Sequence>,
  position: number,
  groupSize: number
) {
  const res = [...sequence];

  if (position - 1 >= 0) {
    if (sequence[position - 1] === "#") {
      throw "booom";
    }
    res[position - 1] = ".";
  }

  if (position + groupSize < sequence.length) {
    if (sequence[position + groupSize] === "#") {
      throw "boooooom";
    }

    res[position + groupSize] = ".";
  }

  for (let i = position; i < position + groupSize; i++) {
    if (sequence[i] === ".") {
      throw "boom";
    }
    res[i] = "#";
  }
  return res;
}

export function buildNextNodes(node: Node, groupsToFind: number[]) {
  const nextNodes: Node[] = [];

  const groupToFind = Math.max(...node.groupsToFind);
  const groupToFindIndex = node.groupsToFind.indexOf(groupToFind);
  let newGroupsToFind = [...node.groupsToFind];
  newGroupsToFind.splice(groupToFindIndex, 1);

  const positions = findWindowPositions(node.sequence, groupToFind);
  for (const position of positions) {
    const sequence = placeGroupAndPadWithZeros(
      node.sequence,
      position,
      groupToFind
    );
    nextNodes.push({
      sequence,
      groupsToFind: newGroupsToFind,
      path: [...node.path, position],
    });
  }
  return nextNodes;
}

function isLeaf(node: Node) {
  return (
    node.sequence.every((x) => x !== "?") || node.groupsToFind.length === 0
  );
}

function buildNextNodesRecursive(
  node: Node,
  groupsToFind: number[],
  stack: Node[] = []
) {
  if (isLeaf(node)) {
    return stack;
  }

  const nextNodes = buildNextNodes(node, groupsToFind);

  for (const nextNode of nextNodes) {
    stack.push(nextNode);
    buildNextNodesRecursive(nextNode, groupsToFind, stack);
  }

  return stack;
}

function canNodeFitSequencesToTheLeft(node: Node) {
  // 3, 4
  // ???####?????
}

export function isSequenceValid(sequence: Sequence, groupsToFind: number[]) {
  const regex =
    "^((Sw+)|S)" + groupsToFind.map((x) => `#{${x}}`).join("w+") + "((w+E)|E)$";
  return new RegExp(regex).test(
    "S" + sequence.join("").replaceAll(".", "w") + "E"
  );
}

export function computeTotalCombinations(rootNode: Node) {
  const groupSizes = [...rootNode.groupsToFind].sort((b, a) => a - b);

  const nodes = buildNextNodesRecursive(rootNode, rootNode.groupsToFind);

  //   for (const nextNode of nodes) {
  //     console.log(
  //       nextNode.path.join(" > ").padEnd(25),
  //       nextNode.sequence
  //         .map((c, i) => {
  //           return i >= +last(nextNode.path)! - 1 &&
  //             i < +last(nextNode.path)! + groupSizes[nextNode.path.length - 1] + 1
  //             ? chalk.bgYellow(c)
  //             : c;
  //         })
  //         .join(""),
  //       isSequenceValid(nextNode.sequence, rootNode.groupsToFind) ? "✅" : "❌",
  //       nextNode.groupsToFind
  //     );
  //   }

  const paths = nodes
    .filter((node) =>
      //node.groupsToFind.length === 0 &&
      isSequenceValid(
        node.sequence.join("").replaceAll("?", ".").split(""),
        rootNode.groupsToFind
      )
    )
    .map((node) => node.sequence.join("").replaceAll("?", "."));
  //.map((node) => [...node.path].sort((a, b) => a - b).join(","));

  //return paths.length;
  return uniq(paths).length;
}

async function part1() {
  const rawInput = await loadInputAsArray("12");

  const rawInputTest = `???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1`.split("\n");

  const input = rawInputTest.map((line) => {
    const [sequence, groupsToFind] = line.split(" ");
    return [sequence.split(""), groupsToFind.split(",").map((x) => +x)] as [
      string[],
      number[],
    ];
  });

  let sum = 0;
  for (let [sequence, groupsToFind] of input) {
    const res = computeTotalCombinations({
      sequence,
      groupsToFind,
      path: [],
    });
    console.log(sequence.join(""), groupsToFind, res);
    sum += res;
  }

  console.log(sum);
}

async function part2() {
  const rawInput = await loadInputAsArray("12");

  const rawInputTest = `???.### 1,1,3
  .??..??...?##. 1,1,3
  ?#?#?#?#?#?#?#? 1,3,1,6
  ????.#...#... 4,1,1
  ????.######..#####. 1,6,5
  ?###???????? 3,2,1`.split("\n");

  const input = rawInputTest.map((line) => {
    const [sequence, groupsToFind] = line.split(" ");
    return [
      Array.from({ length: 5 }, () => sequence)
        .join("?")
        .split(""),
      Array.from({ length: 5 }, () =>
        groupsToFind.split(",").map((x) => +x)
      ).flat(),
    ] as [string[], number[]];
  });

  let sum = 0;
  for (let [sequence, groupsToFind] of input) {
    console.log(sequence.join(""), groupsToFind);

    const res = computeTotalCombinations({
      sequence,
      groupsToFind,
      path: [],
    });
    sum += res;
  }

  console.log(sum);
}

Promise.all([part1()]).then(console.log);
