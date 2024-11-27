import { Mock } from "vitest";
import { render } from "@testing-library/react";
import ControlsPanel from "./ControlsPanel";
import { IGameContext, useGame } from "../utilities/gameContext";
import { setupUserEvents } from "../TestSetup";
import userEvent from "@testing-library/user-event";
import { byRole } from "testing-library-selector";
import { drawNewLiveCells } from "../utilities/drawing";
import { createRef, RefObject } from "react";

vi.mock("../utilities/gameContext", () => ({
  useGame: vi.fn(),
}));

vi.mock("../utilities/drawing", () => ({
  drawNewLiveCells: vi.fn(),
}));

const selectors = {
  playButton: byRole("button", { name: /Play$/ }),
  pauseButton: byRole("button", { name: /Pause$/ }),
  nextButton: byRole("button", { name: /Next$/ }),
  previousButton: byRole("button", { name: /Previous$/ }),
  clearButton: byRole("button", { name: /Clear$/ }),
  resetButton: byRole("button", { name: /Reset$/ }),
};

describe("ControlsPanel Component", () => {
  const mockGenerateNext = vi.fn();
  const mockClearBoard = vi.fn();
  let mockGameContext: Partial<IGameContext>;
  let canvasRef: RefObject<HTMLCanvasElement>;

  beforeEach(() => {
    canvasRef = createRef<HTMLCanvasElement>();
    // @ts-expect-error we need to mutate current to set up for the tests
    canvasRef.current = {
      getContext: () => ({}),
    };
    mockGameContext = {
      speed: 500,
      setSpeed: vi.fn(),
      boardSize: 50,
      setBoardSize: vi.fn(),
      isPlaying: false,
      liveCells: new Set(),
      generation: 0,
      history: [],
      setLiveCells: vi.fn(),
      setIsPlaying: vi.fn(),
      setHistory: vi.fn(),
      setGeneration: vi.fn(),
      reset: vi.fn(),
    };
    (useGame as Mock).mockReturnValue(mockGameContext);
  });

  test("renders all control buttons", () => {
    render(<ControlsPanel generateNext={mockGenerateNext} clearBoard={mockClearBoard} canvasRef={canvasRef} />);

    expect(selectors.playButton.get()).toBeInTheDocument();
    expect(selectors.nextButton.get()).toBeInTheDocument();
    expect(selectors.previousButton.get()).toBeInTheDocument();
    expect(selectors.clearButton.get()).toBeInTheDocument();
    expect(selectors.resetButton.get()).toBeInTheDocument();
  });

  test("calls setIsPlaying when 'Play' is clicked", async () => {
    const userEvent = setupUserEvents();
    render(<ControlsPanel generateNext={mockGenerateNext} clearBoard={mockClearBoard} canvasRef={canvasRef} />);

    await userEvent.click(selectors.playButton.get());

    expect(mockGameContext.setIsPlaying).toHaveBeenCalledTimes(1);
    expect(mockGameContext.setIsPlaying).toHaveBeenCalledWith(expect.any(Function));
  });

  test("disables 'Previous' and 'Next' buttons when playing", () => {
    (useGame as Mock).mockReturnValue({ ...mockGameContext, isPlaying: true });
    render(<ControlsPanel generateNext={mockGenerateNext} clearBoard={mockClearBoard} canvasRef={canvasRef} />);

    expect(selectors.previousButton.get()).toBeDisabled();
    expect(selectors.nextButton.get()).toBeDisabled();
  });

  test("calls generateNext when 'Next' is clicked", async () => {
    const userEvent = setupUserEvents();
    render(<ControlsPanel generateNext={mockGenerateNext} clearBoard={mockClearBoard} canvasRef={canvasRef} />);

    await userEvent.click(selectors.nextButton.get());

    expect(mockGenerateNext).toHaveBeenCalledTimes(1);
  });

  test("calls setLiveCells, setGeneration, setHistory and drawNewLiveCells when 'Previous' is clicked", async () => {
    const historyItem = new Set();
    (useGame as Mock).mockReturnValue({ ...mockGameContext, history: [historyItem], generation: 2 });

    const userEvent = setupUserEvents();
    render(<ControlsPanel generateNext={mockGenerateNext} clearBoard={mockClearBoard} canvasRef={canvasRef} />);

    await userEvent.click(selectors.previousButton.get());

    expect(mockGameContext.setLiveCells).toHaveBeenCalledTimes(1);
    expect(mockGameContext.setLiveCells).toHaveBeenCalledWith(historyItem);
    expect(mockGameContext.setGeneration).toHaveBeenCalledTimes(1);
    expect(mockGameContext.setHistory).toHaveBeenCalledTimes(1);
    expect(drawNewLiveCells).toHaveBeenLastCalledWith({}, historyItem, mockGameContext.boardSize);
  });

  test("calls initBoard when 'Clear' is clicked", async () => {
    render(<ControlsPanel generateNext={mockGenerateNext} clearBoard={mockClearBoard} canvasRef={canvasRef} />);

    await userEvent.click(selectors.clearButton.get());
    expect(mockClearBoard).toHaveBeenCalledTimes(1);
  });

  test("calls initBoard when 'Reset' is clicked", async () => {
    (useGame as Mock).mockReturnValue({
      ...mockGameContext,
      reset: vi.fn().mockImplementation((callback: () => void) => {
        callback();
      }),
    });
    const userEvent = setupUserEvents();

    render(<ControlsPanel generateNext={mockGenerateNext} clearBoard={mockClearBoard} canvasRef={canvasRef} />);

    await userEvent.click(selectors.resetButton.get());

    expect(drawNewLiveCells).toHaveBeenCalledWith({}, undefined, mockGameContext.boardSize);
  });

  test("renders 'Pause' when playing is true", () => {
    (useGame as Mock).mockReturnValue({
      isPlaying: true,
    });

    render(<ControlsPanel generateNext={mockGenerateNext} clearBoard={mockClearBoard} canvasRef={canvasRef} />);

    expect(selectors.pauseButton.get()).toBeInTheDocument();
    expect(selectors.playButton.query()).not.toBeInTheDocument();
  });
});
