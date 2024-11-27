import { render, screen } from "@testing-library/react";
import { useGame } from "../utilities/gameContext";
import RulesDrawer from "./RulesDrawer";
import { Mock } from "vitest";

vi.mock("../utilities/gameContext", () => ({
  useGame: vi.fn(),
}));

describe("RulesDrawer Component", () => {
  test("should render the RulesDrawer with the correct title and rules", () => {
    (useGame as Mock).mockReturnValue({ areRulesOpen: true });

    render(<RulesDrawer />);

    expect(screen.getByText("Game Of Life Rules")).toBeInTheDocument();

    expect(screen.getByText("Conway's game of life is a zero-player game. Set up initial colony and watch it evolving based on following rules:")).toBeInTheDocument();

    expect(screen.getByText("A dead cell will become alive in the next generation if it has exactly 3 alive neighbors.")).toBeInTheDocument();
    expect(screen.getByText("An alive cell will stay alive in the next generation if it has 2 or 3 alive neighbors.")).toBeInTheDocument();
    expect(
      screen.getByText("If cell is lonely (less than 2 neighbors) or overcrowded (more than 3 neighbors) it will die or remain dead in the next generation.")
    ).toBeInTheDocument();
    expect(document.getElementsByTagName("aside")[0]).not.toHaveClass("ant-layout-sider-collapsed");
  });

  test("should not render the RulesDrawer content when areRulesOpen is false", () => {
    (useGame as Mock).mockReturnValue({ areRulesOpen: false });

    render(<RulesDrawer />);

    expect(document.getElementsByTagName("aside")[0]).toHaveClass("ant-layout-sider-collapsed");
  });
});
