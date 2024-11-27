import { render } from "@testing-library/react";
import { byText } from "testing-library-selector";
import InteractionControls from "./InteractionControls";

const selectors = {
  firstControl: byText("[LMB] - change a cell state (in non-active state)"),
  secondControl: byText("[LMB + drag] - change state of cells mouse drags over (state changes based on the first cell new state; in non-active state)"),
  thirdControl: byText("[RMB + drag] - move around the canvas when canvas is too big (indicated by shading on the borders)"),
};

test("controls are rendered", () => {
  render(<InteractionControls />);

  expect(selectors.firstControl.get()).toBeInTheDocument();
  expect(selectors.secondControl.get()).toBeInTheDocument();
  expect(selectors.thirdControl.get()).toBeInTheDocument();
});
