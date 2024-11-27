import { render, fireEvent } from "@testing-library/react";
import { IGameContext, useGame } from "../utilities/gameContext";
import BoardSettings from "./BoardSettings";
import { createRef, RefObject } from "react";
import { Mock } from "vitest";
import { gliderGun } from "../presets/glider_gun";
import { pulsar } from "../presets/pulsar";
import { byRole, byText } from "testing-library-selector";
import { setupUserEvents } from "../TestSetup";
import { drawNewLiveCells } from "../utilities/drawing";

// Mock the useGame hook
vi.mock("../utilities/gameContext", () => ({
  useGame: vi.fn(),
}));

vi.mock("../utilities/drawing", () => ({
  drawNewLiveCells: vi.fn(),
}));

const selectors = {
  importButton: byRole("button", { name: /Import board from JSON file$/ }),
  speedInput: byRole("spinbutton", { name: "Speed" }),
  boardSizeInput: byRole("spinbutton", { name: "BoardSize" }),
  presetSelector: byRole("combobox", { name: "Preset" }),
};

describe("BoardSettings", () => {
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
      setLiveCells: vi.fn(),
    };
    (useGame as Mock).mockReturnValue(mockGameContext);
  });

  test("renders correctly", () => {
    render(<BoardSettings canvasRef={canvasRef} />);

    expect(selectors.importButton.get()).toBeInTheDocument();
    expect(selectors.speedInput.get()).toBeInTheDocument();
    expect(selectors.boardSizeInput.get()).toBeInTheDocument();
    expect(selectors.presetSelector.get()).toBeInTheDocument();
  });

  test("changes speed correctly", async () => {
    render(<BoardSettings canvasRef={canvasRef} />);
    const input = selectors.speedInput.get();

    fireEvent.change(input, { target: { value: 300 } });

    expect(mockGameContext.setSpeed).toHaveBeenCalledWith(300);
  });

  test("disables board size input when playing", () => {
    mockGameContext.isPlaying = true;
    render(<BoardSettings canvasRef={canvasRef} />);

    expect(selectors.boardSizeInput.get()).toBeDisabled();
  });

  test("loads the glider gun preset correctly", async () => {
    const userEvent = setupUserEvents();

    render(<BoardSettings canvasRef={canvasRef} />);

    const select = selectors.presetSelector.get();

    await userEvent.click(select);
    await userEvent.click(byText("Glider Gun").get());

    expect(mockGameContext.setBoardSize).toHaveBeenCalledWith(gliderGun.boardSize);
    expect(mockGameContext.setLiveCells).toHaveBeenCalledWith(new Set(gliderGun.liveCells));
    expect(drawNewLiveCells as Mock).toHaveBeenCalledWith({}, new Set(gliderGun.liveCells), gliderGun.boardSize);
  });

  test("loads the pulsar preset correctly", async () => {
    const userEvent = setupUserEvents();

    render(<BoardSettings canvasRef={canvasRef} />);

    const select = selectors.presetSelector.get();

    await userEvent.click(select);
    await userEvent.click(byText("Pulsar").get());

    expect(mockGameContext.setBoardSize).toHaveBeenCalledWith(pulsar.boardSize);
    expect(mockGameContext.setLiveCells).toHaveBeenCalledWith(new Set(pulsar.liveCells));
    expect(drawNewLiveCells as Mock).toHaveBeenCalledWith({}, new Set(pulsar.liveCells), pulsar.boardSize);
  });

  test("displays generation and live cells count", () => {
    render(<BoardSettings canvasRef={canvasRef} />);
    expect(byText(/Generation:/i).get()).toBeInTheDocument();
    expect(byText(/Live cells:/i).get()).toBeInTheDocument();
  });

  // TODO: needs further digging into upload component of the library
  // test("handles JSON file upload correctly", async () => {
  //   const userEvent = setupUserEvents();

  //   const jsonPreset = JSON.stringify(gliderGun);
  //   const file = new File([jsonPreset], "preset.json", { type: "application/json" });
  //   render(<BoardSettings canvasRef={canvasRef} />);

  //   const input = byTestId("Uploader").get().getElementsByTagName("input")[0];

  //   await userEvent.upload(input, file)

  //   expect(mockGameContext.setBoardSize).toHaveBeenCalledWith(gliderGun.boardSize);
  //   expect(mockGameContext.setLiveCells).toHaveBeenCalledWith(new Set(gliderGun.liveCells));
  // });
});
