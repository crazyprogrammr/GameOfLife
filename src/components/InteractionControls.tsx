import { CardContent, ControlRow, ControlsHeader, DisplayCard } from "../styles";

const InteractionControls = () => {
  return (
    <DisplayCard>
      <CardContent>
        <ControlsHeader level={5}>Controls</ControlsHeader>
        <ControlRow>[LMB] - change a cell state (in non-active state)</ControlRow>
        <ControlRow>[LMB + drag] - change state of cells mouse drags over (state changes based on the first cell new state; in non-active state)</ControlRow>
        <ControlRow>[RMB + drag] - move around the canvas when canvas is too big (indicated by shading on the borders)</ControlRow>
      </CardContent>
    </DisplayCard>
  );
};

export default InteractionControls;
