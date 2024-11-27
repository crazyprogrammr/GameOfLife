import { MouseEvent, RefObject, useCallback, useEffect, useRef, useState } from "react";
import { Canvas, CanvasFrame, CanvasWrapper, OverflowIndicatorBottom, OverflowIndicatorLeft, OverflowIndicatorRight, OverflowIndicatorTop } from "../styles";
import { useGame } from "../utilities/gameContext";
import { calcPosition } from "../utilities/grid";
import { ILiveCells } from "../types";
import { drawCell } from "../utilities/drawing";

interface ICanvasProps {
  canvasRef: RefObject<HTMLCanvasElement>;
  canvasRedraw: () => void;
}

const CanvasGrid = (props: ICanvasProps) => {
  const { canvasRef, canvasRedraw } = props;
  const mouseHold = useRef<null | [number, number, number]>(null);
  const [isPanOn, setIsPanOn] = useState(false);
  const [overflow, setOverflow] = useState([false, false, false, false]);

  const canvasWrapperRef = useRef<HTMLDivElement>(null);

  const { liveCells, reset, cellSize, isPlaying, boardSize, setLiveCells } = useGame();

  const toggleCell = useCallback(
    (i: number, j: number, value: number) => {
      const canvas = canvasRef.current;
      if (canvas) {
        const context = canvas.getContext("2d") as CanvasRenderingContext2D;
        setLiveCells((cells) => {
          const copyCells = new Set([...cells]) as ILiveCells;

          //if value has changed, redraw the cell
          if ((cells.has(`${i};${j}`) && !value) || (value && !cells.has(`${i};${j}`))) {
            drawCell(i, j, cellSize, context, value === 0 ? "white" : "black");
            if (value) {
              copyCells.add(`${i};${j}`);
            } else {
              copyCells.delete(`${i};${j}`);
            }
          }

          return copyCells as ILiveCells;
        });
      }
    },
    [setLiveCells, cellSize, canvasRef]
  );

  const scrollHandler = useCallback(() => {
    const canvasWrapper = canvasWrapperRef.current;
    if (canvasWrapper) {
      const { scrollLeft, scrollTop } = canvasWrapper;

      setOverflow([scrollLeft > 0, scrollTop > 0, scrollLeft + 700 < cellSize * boardSize, scrollTop + 700 < cellSize * boardSize]);
    }
  }, [boardSize, cellSize]);

  useEffect(() => {
    canvasRedraw();
    scrollHandler();
  }, [canvasRedraw, scrollHandler]);

  // mouse click (down phase) handler
  const mouseDownHandler = useCallback(
    (event: MouseEvent<HTMLCanvasElement>) => {
      if (event.button === 0 && !isPlaying) {
        reset();
        const [x, y] = calcPosition(event, cellSize, boardSize);
        const value = liveCells.has(`${x};${y}`) ? 0 : 1;
        mouseHold.current = [x, y, value];
        setIsPanOn(false);
        toggleCell(x, y, value);
      } else if (event.button === 2) {
        event.preventDefault();
        setIsPanOn(true);
      }
    },
    [cellSize, boardSize, liveCells, toggleCell, reset, isPlaying]
  );

  // mouse move hanlder
  const mouseMoveHanlder = useCallback(
    (event: MouseEvent<HTMLCanvasElement>) => {
      if (isPanOn) {
        const canvasWrapper = canvasWrapperRef.current;
        if (canvasWrapper) {
          canvasWrapper.scrollTo(canvasWrapper.scrollLeft - event.movementX, canvasWrapper.scrollTop - event.movementY);
        }
      } else {
        if (mouseHold.current && !isPlaying) {
          const [x, y] = calcPosition(event, cellSize, boardSize);
          if (x !== mouseHold.current[0] || y !== mouseHold.current[1]) {
            const value = mouseHold.current[2];
            mouseHold.current = [x, y, value];
            toggleCell(x, y, value);
          }
        }
      }
    },
    [boardSize, isPanOn, cellSize, isPlaying, toggleCell]
  );

  // mouse click (up phase) handler
  const mouseUpHandler = useCallback(() => {
    mouseHold.current = null;
    setIsPanOn(false);
  }, []);

  // mouse leave handler to disable panning/drawing
  const mouseLeaveHandler = useCallback(() => {
    mouseHold.current = null;
    setIsPanOn(false);
  }, []);

  return (
    <CanvasFrame>
      {/* overflow indicators for better UX */}
      <OverflowIndicatorLeft $isVisible={overflow[0]} />
      <OverflowIndicatorTop $isVisible={overflow[1]} />
      <OverflowIndicatorRight $isVisible={overflow[2]} />
      <OverflowIndicatorBottom $isVisible={overflow[3]} />

      <CanvasWrapper ref={canvasWrapperRef} onScroll={scrollHandler}>
        <Canvas
          ref={canvasRef}
          data-testid="gridCanvas"
          width={cellSize * boardSize}
          height={cellSize * boardSize}
          onMouseDown={mouseDownHandler}
          onMouseUp={mouseUpHandler}
          onMouseMove={mouseMoveHanlder}
          onContextMenu={(e) => e.preventDefault()}
          onMouseLeave={mouseLeaveHandler}
        />
      </CanvasWrapper>
    </CanvasFrame>
  );
};

export default CanvasGrid;
