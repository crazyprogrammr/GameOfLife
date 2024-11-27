import { ILiveCells } from "../types";
import { calcCellSize } from "./grid";

export const drawLine = (xStart: number, yStart: number, xEnd: number, yEnd: number, context: CanvasRenderingContext2D) => {
  context.moveTo(xStart, yStart);
  context.lineTo(xEnd, yEnd);
};

export const drawCell = (x: number, y: number, cellSize: number, context: CanvasRenderingContext2D, color: string) => {
  context.fillStyle = color;
  context.lineWidth = 2;
  context.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
  context.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
};

export const drawEmptyGrid = (context: CanvasRenderingContext2D, boardSize: number, cellSize: number) => {
  context.fillStyle = "white";
  context.lineWidth = 2;
  context.strokeStyle = "#A9A9A9";
  context.clearRect(0, 0, boardSize * cellSize, boardSize * cellSize);
  context.fillRect(0, 0, boardSize * cellSize, boardSize * cellSize);
  context.beginPath();
  for (let i = 0; i <= boardSize; i++) {
    drawLine(i * cellSize, 0, i * cellSize, boardSize * cellSize, context);
    drawLine(0, i * cellSize, boardSize * cellSize, i * cellSize, context);
  }
  context.stroke();
};

export const drawNewLiveCells = (context: CanvasRenderingContext2D, liveCells: ILiveCells | undefined, boardSize: number) => {
  const cellSize = calcCellSize(boardSize);

  drawEmptyGrid(context, boardSize, cellSize);
  liveCells?.forEach((cell) => {
    const [x, y] = cell.split(";").map((el) => Number(el));
    drawCell(x, y, cellSize, context, "black");
  });
};
