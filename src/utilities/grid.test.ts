import { calcCellSize, calcNeighbors, calcPosition } from "./grid";
import { ILiveCells } from "../types";
import { MouseEvent } from "react";

describe("Grid utility functions", () => {
  describe("calcCellSize", () => {
    test("returns a minimum cell size of 10", () => {
      expect(calcCellSize(1000)).toBe(10);
    });

    test("calculates the cell size based on the board size", () => {
      expect(calcCellSize(10)).toBe(70)
      expect(calcCellSize(50)).toBe(14); 
    });
  });

  describe("calcNeighbors", () => {
    test("returns correct neighbors and alive count", () => {
      const boardSize = 5;
      const liveCells: ILiveCells = new Set(["1;1", "2;2", "3;3"]);

      const { neighbors, aliveCount } = calcNeighbors(2, 2, boardSize, liveCells);

      expect(neighbors.size).toBe(8);
      expect(aliveCount).toBe(2);
    });

    test("handles cases at the board edge", () => {
      const boardSize = 3;
      const liveCells: ILiveCells = new Set(["0;1", "1;0"]);

      const { neighbors, aliveCount } = calcNeighbors(0, 0, boardSize, liveCells);

      expect(neighbors.size).toBe(3);
      expect(aliveCount).toBe(2);
    });
  });

  describe("calcPosition", () => {
    const createMockEvent = (offsetX: number, offsetY: number): MouseEvent<HTMLCanvasElement> =>
      ({
        nativeEvent: { offsetX, offsetY },
      } as unknown as MouseEvent<HTMLCanvasElement>);

    test("calculates the correct cell position within bounds", () => {
      const cellSize = 20;
      const side = 10;

      const position = calcPosition(createMockEvent(45, 65), cellSize, side);

      expect(position).toEqual([2, 3]);
    });
  });
});
