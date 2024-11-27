import { Button } from "antd";
import { Controls, EndControls, StartControls } from "../styles";
import { useGame } from "../utilities/gameContext";
import { CaretRightOutlined, DeleteOutlined, PauseOutlined, RedoOutlined, StepBackwardOutlined, StepForwardOutlined } from "@ant-design/icons";
import { drawNewLiveCells } from "../utilities/drawing";
import { RefObject } from "react";

interface IControlsPanelProps {
  clearBoard: () => void;
  generateNext: () => void;
  canvasRef: RefObject<HTMLCanvasElement>;
}

const ControlsPanel = (props: IControlsPanelProps) => {
  const { clearBoard, generateNext, canvasRef } = props;
  const { isPlaying, setIsPlaying, reset, generation, history, setLiveCells, setGeneration, boardSize, setHistory } = useGame();

  return (
    <Controls>
      <StartControls>
        <Button
          variant="solid"
          type="primary"
          disabled={isPlaying || generation === 1}
          icon={<StepBackwardOutlined />}
          iconPosition="end"
          onClick={() => {
            if (generation > 1 && canvasRef.current) {
              const context = canvasRef.current.getContext("2d") as CanvasRenderingContext2D;
              drawNewLiveCells(context, history[generation - 2], boardSize);
              setLiveCells(history[generation - 2]);
              setGeneration((gen) => gen - 1);
              setHistory((oldHistory) => {
                const copy = [...oldHistory];
                copy.pop();
                return copy;
              });
            }
          }}
        >
          Previous
        </Button>
        <Button
          variant="solid"
          type="primary"
          icon={isPlaying ? <PauseOutlined /> : <CaretRightOutlined />}
          iconPosition="end"
          onClick={() => {
            setIsPlaying((running) => !running);
          }}
        >
          {isPlaying ? "Pause" : "Play"}
        </Button>
        <Button variant="solid" type="primary" disabled={isPlaying} icon={<StepForwardOutlined />} onClick={generateNext}>
          Next
        </Button>
      </StartControls>
      <EndControls>
        <Button variant="solid" type="primary" disabled={isPlaying} icon={<DeleteOutlined />} iconPosition="end" onClick={clearBoard}>
          Clear
        </Button>
        <Button
          variant="solid"
          type="primary"
          disabled={isPlaying}
          icon={<RedoOutlined />}
          iconPosition="end"
          onClick={() => {
            reset(() => {
              if (canvasRef.current) {
                const context = canvasRef.current.getContext("2d") as CanvasRenderingContext2D;
                drawNewLiveCells(context, history[0], boardSize);
              }
            });
          }}
        >
          Reset
        </Button>
      </EndControls>
    </Controls>
  );
};

export default ControlsPanel;
