import { render, fireEvent, createEvent } from "@testing-library/react";
import CanvasGrid from "./CanvasGrid";
import { useGame } from "../utilities/gameContext";
import { Mock } from "vitest";
import { ILiveCells } from "../types";
import { drawCell } from "../utilities/drawing";
import { byTestId } from "testing-library-selector";

vi.mock("../utilities/gameContext", () => ({
  useGame: vi.fn(),
}));

vi.mock("../utilities/drawing", () => ({
  drawCell: vi.fn(),
}));

describe("CanvasGrid Component", () => {
  const mockCanvasRef = { current: null } as React.RefObject<HTMLCanvasElement>;
  const mockCanvasRedraw = vi.fn();

  beforeEach(() => {
    Element.prototype.scrollTo = () => {};

    vi.clearAllMocks();

    const mockGameContext = {
      boardSize: 10,
      liveCells: new Set(["2;3"]),
      reset: vi.fn(),
      cellSize: 50,
      isPlaying: false,
      setLiveCells: vi.fn().mockImplementation((fn: (cells: ILiveCells) => void) => fn(new Set(["2;3"]))),
    };
    (useGame as Mock).mockReturnValue(mockGameContext);
  });

  test("renders the canvas correctly", () => {
    render(<CanvasGrid canvasRef={mockCanvasRef} canvasRedraw={mockCanvasRedraw} />);

    expect(mockCanvasRef.current).toHaveAttribute("width", "500");
    expect(mockCanvasRef.current).toHaveAttribute("height", "500");
  });

  test("calls the canvasRedraw function on mount", () => {
    render(<CanvasGrid canvasRef={mockCanvasRef} canvasRedraw={mockCanvasRedraw} />);

    expect(mockCanvasRedraw).toHaveBeenCalled();
  });

  test("handles left mouse click to toggle cell state", () => {
    render(<CanvasGrid canvasRef={mockCanvasRef} canvasRedraw={mockCanvasRedraw} />);

    const canvas = byTestId("gridCanvas").get();

    const event = createEvent.mouseDown(canvas, { button: 0 });
    fireEvent(canvas, event);

    expect(drawCell).toHaveBeenCalledWith(0, 0, 50, mockCanvasRef.current?.getContext("2d"), "black");
  });

  test("handles mouse drag to update multiple cells", () => {
    render(<CanvasGrid canvasRef={mockCanvasRef} canvasRedraw={mockCanvasRedraw} />);

    const canvas = byTestId("gridCanvas").get();

    fireEvent.mouseDown(canvas, { button: 0 });
    fireEvent.mouseMove(canvas);

    expect(drawCell).toHaveBeenCalledWith(0, 0, 50, mockCanvasRef.current?.getContext("2d"), "black");
    expect(drawCell).toHaveBeenCalledWith(0, 0, 50, mockCanvasRef.current?.getContext("2d"), "black");
  });

  test("handles right mouse click to enable panning", () => {
    render(<CanvasGrid canvasRef={mockCanvasRef} canvasRedraw={mockCanvasRedraw} />);

    const canvas = byTestId("gridCanvas").get();

    fireEvent.mouseDown(canvas, { button: 2 });
    fireEvent.mouseMove(canvas);

    expect(drawCell).not.toHaveBeenCalled();
  });

  test("resets the mouse state on mouse leave", () => {
    render(<CanvasGrid canvasRef={mockCanvasRef} canvasRedraw={mockCanvasRedraw} />);

    const canvas = byTestId("gridCanvas").get();

    fireEvent.mouseDown(canvas, { button: 0 });
    fireEvent.mouseLeave(canvas);
    fireEvent.mouseMove(canvas);

    expect(drawCell).toHaveBeenCalledTimes(1);
  });
});
