import { drawLine, drawCell, drawEmptyGrid, drawNewLiveCells } from "./drawing";

const mockContext = {
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  beginPath: vi.fn(),
  stroke: vi.fn(),
  fillRect: vi.fn(),
  strokeRect: vi.fn(),
  clearRect: vi.fn(),
  fillStyle: "",
  strokeStyle: "",
  lineWidth: 0,
} as unknown as CanvasRenderingContext2D;

describe("drawUtils", () => {
  test("drawLine: draws a line from start to end", () => {
    drawLine(0, 0, 100, 100, mockContext);

    expect(mockContext.moveTo).toHaveBeenCalledWith(0, 0);
    expect(mockContext.lineTo).toHaveBeenCalledWith(100, 100);
  });

  test("drawCell: draws a cell at the specified coordinates with the given size and color", () => {
    drawCell(2, 3, 10, mockContext, "red");

    expect(mockContext.fillStyle).toBe("red");
    expect(mockContext.fillRect).toHaveBeenCalledWith(20, 30, 10, 10);
    expect(mockContext.strokeRect).toHaveBeenCalledWith(20, 30, 10, 10);
  });

  describe("drawEmptyGrid", () => {
    test("draws an empty grid with the specified board size and cell size", () => {
      drawEmptyGrid(mockContext, 5, 10);

      expect(mockContext.fillStyle).toBe("white");
      expect(mockContext.strokeStyle).toBe("#A9A9A9");
      expect(mockContext.clearRect).toHaveBeenCalledWith(0, 0, 50, 50);
      expect(mockContext.fillRect).toHaveBeenCalledWith(0, 0, 50, 50);
      expect(mockContext.beginPath).toHaveBeenCalled();
      expect(mockContext.stroke).toHaveBeenCalled();
    });

    test("draws the correct number of grid lines", () => {
      drawEmptyGrid(mockContext, 2, 10);

      expect(mockContext.moveTo).toHaveBeenCalledTimes(6);
      expect(mockContext.lineTo).toHaveBeenCalledTimes(6);
    });
  });

  describe("drawNewLiveCells", () => {
    test("clears and redraws the grid, then draws live cells", () => {
      const cellSize = 700 / 3;
      const liveCells = new Set(["0;0", "1;1", "2;2"]);
      drawNewLiveCells(mockContext, liveCells, 3);

      expect(mockContext.clearRect).toHaveBeenCalledWith(0, 0, 700, 700);

      // Ensure each live cell is drawn
      expect(mockContext.fillRect).toHaveBeenCalledWith(0, 0, 700, 700);
      expect(mockContext.fillRect).toHaveBeenCalledWith(cellSize, cellSize, cellSize, cellSize);
      expect(mockContext.fillRect).toHaveBeenCalledWith(cellSize * 2, cellSize * 2, cellSize, cellSize);
    });

    test("handles empty liveCells gracefully", () => {
      drawNewLiveCells(mockContext, undefined, 3);

      expect(mockContext.clearRect).toHaveBeenCalledWith(0, 0, 700, 700);
      expect(mockContext.fillRect).toHaveBeenCalledTimes(1);
    });
  });
});
