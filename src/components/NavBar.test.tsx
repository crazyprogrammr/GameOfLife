import { Mock } from "vitest";
import { render, screen } from "@testing-library/react";
import NavBar from "./NavBar";
import { useGame } from "../utilities/gameContext";
import { RefObject } from "react";
import { setupUserEvents } from "../TestSetup";
import { byRole, byText } from "testing-library-selector";

vi.mock("../utilities/gameContext", () => ({
  useGame: vi.fn(),
}));

const selectors = {
  exportButton: byRole("button", { name: /Export$/ }),
  openRulesButton: byRole("button", { name: /Rules$/ }),
  closeRulesButton: byRole("button", { name: /Close Rules$/ }),
};

describe("NavBar Component", () => {
  const mockSetAreRulesOpen = vi.fn();

  beforeEach(() => {
    (useGame as Mock).mockReturnValue({
      setAreRulesOpen: mockSetAreRulesOpen,
      areRulesOpen: false,
      liveCells: new Set("1;1"),
      boardSize: 40,
      speed: 200,
    });
  });

  test("should render the NavBar with the correct title", () => {
    const mockCanvasRef = { current: null } as RefObject<HTMLCanvasElement>;

    render(<NavBar canvasRef={mockCanvasRef} />);

    expect(byText("Conway's Game of Life").get()).toBeInTheDocument();
  });

  test("should toggle the rules visibility when the 'Rules' button is clicked", async () => {
    const userEvent = setupUserEvents();
    const mockCanvasRef = { current: null } as RefObject<HTMLCanvasElement>;

    render(<NavBar canvasRef={mockCanvasRef} />);

    await userEvent.click(selectors.openRulesButton.get());

    expect(mockSetAreRulesOpen).toHaveBeenCalled();
    expect(mockSetAreRulesOpen).toHaveBeenCalledWith(expect.any(Function));
  });

  test("should export canvas content as PNG when the 'Export as PNG' option is clicked", async () => {
    const userEvent = setupUserEvents();

    const mockCanvas = document.createElement("canvas");
    mockCanvas.toDataURL = vi.fn(() => "imagePNG");
    const mockCanvasRef = { current: mockCanvas } as RefObject<HTMLCanvasElement>;

    render(<NavBar canvasRef={mockCanvasRef} />);

    await userEvent.click(selectors.exportButton.get());

    const pngOption = screen.getByText("Export as PNG");
    await userEvent.click(pngOption);

    expect(mockCanvas.toDataURL).toHaveBeenCalledWith("image/png");
  });

  it("calls downloadJSON when Export as JSON is clicked", async () => {
    const mockCanvasRef = { current: null } as RefObject<HTMLCanvasElement>;
    const userEvent = setupUserEvents();
    const output = { boardSize: 40, speed: 200, liveCells: ["1;1"] };
    const blob = new Blob([JSON.stringify(output)], { type: "text/json" });

    render(<NavBar canvasRef={mockCanvasRef} />);

    const mockCreateObjectURL = vi.fn(() => "jsonURL");
    window.URL.createObjectURL = mockCreateObjectURL;

    await userEvent.click(selectors.exportButton.get());

    const pngOption = screen.getByText("Export as JSON");
    await userEvent.click(pngOption);

    expect(mockCreateObjectURL).toHaveBeenCalledWith(blob);
  });
});
