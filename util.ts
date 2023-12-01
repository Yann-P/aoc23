import { readFile } from "fs/promises";
import { join } from "path";

export async function loadInput(day: string) {
  return readFile(join('inputs', `${day}.txt`), 'utf-8')
}

export async function loadInputAsArray(day: string) {
  return (await loadInput(day)).split('\n').filter(Boolean)
}
