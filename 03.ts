import { loadInputAsArray } from "./util";
import { range } from 'lodash'

type SchematicNumber = {
  value: string;
  row: number;
  fromCol: number; // incl.
  toCol: number; // incl.
}

export const parseInputAsGrid = (input: string[]): string[][] => input.map(line => line.split(''));

function getSchematicNumbers(input: string[]): SchematicNumber[] {
  return input.reduce((schematicNumbers, line, row) => {
    var regex = /\d+/g;
    let match: RegExpExecArray | null;
    while ((match = regex.exec(line)) !== null) {
      schematicNumbers.push({
        value: match[0],
        row,
        fromCol: match.index,
        toCol: match.index + match[0].length - 1
      })
    }
    return schematicNumbers;
  }, [] as SchematicNumber[]);
}

function getAdjacentCoordinatesToSchematicNumber(schematicNumber: SchematicNumber): number[][] {
  return [
    // on top
    ...range(schematicNumber.fromCol - 1, schematicNumber.toCol + 1 + 1).map(col => ([schematicNumber.row - 1, col])),
    // bottom
    ...range(schematicNumber.fromCol - 1, schematicNumber.toCol + 1 + 1).map(col => ([schematicNumber.row + 1, col])),
    // left
    [schematicNumber.row, schematicNumber.fromCol - 1],
    // right
    [schematicNumber.row, schematicNumber.toCol + 1]
  ]
}

export function getSumOfEngineNumbers(input: string[]) {
  const grid = parseInputAsGrid(input);
  const schematicNumbers = getSchematicNumbers(input)
  const engineNumbers = schematicNumbers.filter(schematicNumber => {
    const adjacentCoordinates: number[][] = getAdjacentCoordinatesToSchematicNumber(schematicNumber)
      .filter(([row, col]) => row >= 0 && col >= 0 && row < grid.length && col < grid[0].length);

    return adjacentCoordinates.some(
      adjacentCoordinate => !(/\d|\./.test(grid[adjacentCoordinate[0]][adjacentCoordinate[1]]))
    );
  })

  return engineNumbers.reduce((total, engineNumber) => total + +engineNumber.value, 0)
}

export function getSumOfGearRatios(input: string[]) {
  const grid = parseInputAsGrid(input);
  const schematicNumbers = getSchematicNumbers(input);
  const gearPositionsWithEngineNumbers: { [pos: string /*x,y*/]: number[] } = {};

  schematicNumbers.forEach(num => {
    const adjacentCoordinates: number[][] = getAdjacentCoordinatesToSchematicNumber(num)
      .filter(([row, col]) => row >= 0 && col >= 0 && row < grid.length && col < grid[0].length);

    adjacentCoordinates.filter(
      coord => grid[coord[0]][coord[1]] === '*'
    ).forEach(coordWithGear => {
      const serializedPosition = coordWithGear.join(',');
      gearPositionsWithEngineNumbers[serializedPosition] ??= [];
      gearPositionsWithEngineNumbers[serializedPosition].push(+num.value);
    })
  })

  return Object.values(gearPositionsWithEngineNumbers).reduce((total, values) => {
    if (values.length === 2) {
      total += values[0] * values[1];
    }
    return total;
  }, 0);
}

async function part1() {
  const input = await loadInputAsArray("03");
  return getSumOfEngineNumbers(input)
}

async function part2() {
  const input = await loadInputAsArray("03");
  return getSumOfGearRatios(input)
}

Promise.all([part1(), part2()]).then(console.log)
