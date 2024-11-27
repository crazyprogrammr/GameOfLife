import { MouseEvent } from "react";
import { ILiveCells } from "../types";

export const calcCellSize = (boardSize: number) => {
  return Math.max(10, 700 / boardSize);
};

export const neigborsOffset = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0],
];

export const calcNeighbors = (i: number, j: number, boardSize: number, liveCells: ILiveCells): { neighbors: Set<string>; aliveCount: number } => {
  const neighbors = new Set<string>();
  let aliveCount = 0;
  neigborsOffset.forEach(([x, y]) => {
    const newI = i + x;
    const newJ = j + y;
    if (newI >= 0 && newI < boardSize && newJ >= 0 && newJ < boardSize) {
      neighbors.add(`${newI};${newJ}`);
      aliveCount += liveCells.has(`${newI};${newJ}`) ? 1 : 0;
    }
  });
  return { neighbors, aliveCount };
};

export const calcPosition = (event: MouseEvent<HTMLCanvasElement>, cellSize: number, side: number) => {
  const clickX = event.nativeEvent.offsetX;
  const clickY = event.nativeEvent.offsetY;
  const x = Math.max(Math.min(Math.floor(clickX / cellSize), side - 1), 0);
  const y = Math.max(Math.min(Math.floor(clickY / cellSize), side - 1), 0);

  return [x, y];
};
