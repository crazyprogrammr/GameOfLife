import { useCallback, useEffect, useRef } from "react";
import "./App.css";
import { drawCell, drawEmptyGrid } from "./utilities/drawing";
import CanvasGrid from "./components/CanvasGrid";
import { CardsWrapper, ContentContainer, Game, GameWrapper } from "./styles";
import NavBar from "./components/NavBar";
import { Layout } from "antd";
import RulesDrawer from "./components/RulesDrawer";
import { useGame } from "./utilities/gameContext";
import ControlsPanel from "./components/ControlsPanel";
import BoardSettings from "./components/BoardSettings";
import { ILiveCells } from "./types";
import { calcNeighbors } from "./utilities/grid";
import InteractionControls from "./components/InteractionControls";

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timerRef = useRef<number>();
  const animationRequest = useRef<number>();
  const speedTimerRef = useRef<number>();

  const { boardSize, speed, isPlaying, setLiveCells, clear, setHistory, setGeneration, cellSize } = useGame();

  const runSimulation = useCallback(
    (autoGeneration: boolean = true) => {
      if (!canvasRef.current) {
        return;
      }
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d") as CanvasRenderingContext2D;

      setLiveCells((exLiveCells) => {
        const newLiveCells = new Set() as ILiveCells;
        const cellsToCheck: Set<string> = new Set<string>();
        let changeHappened = false;

        exLiveCells.forEach((pair) => {
          const [i, j] = pair.split(";").map((el) => Number(el));
          const { neighbors } = calcNeighbors(i, j, boardSize, exLiveCells);
          neighbors.forEach((neighbor) => cellsToCheck.add(neighbor));
          cellsToCheck.add(`${i};${j}`);
        });

        // loop through cells we need to check to determine new state
        cellsToCheck.forEach((pair) => {
          const [i, j] = pair.split(";").map((el) => Number(el));
          const isLive = exLiveCells.has(`${i};${j}`);

          const { aliveCount } = calcNeighbors(i, j, boardSize, exLiveCells);

          // underpopulation / overpopulation
          if (aliveCount < 2 || aliveCount > 3) {
            // if cell was alive, kill it off
            if (isLive) {
              drawCell(i, j, cellSize, context, "white");
              changeHappened = true;
            }
            // if cell was dead but had 3 alive neighbors
          } else if (!isLive && aliveCount === 3) {
            newLiveCells.add(`${i};${j}`);
            drawCell(i, j, cellSize, context, "black");
            changeHappened = true;
            // if cell was alive and has 2 or 3 neighbors
          } else if (isLive) {
            newLiveCells.add(`${i};${j}`);
          }
        });

        setHistory((history) => (changeHappened ? [...history, exLiveCells] : history));
        setGeneration((gen) => (changeHappened ? gen + 1 : gen));

        return changeHappened ? newLiveCells : exLiveCells;
      });

      // if simulation is running and change happened, request animation frame to draw smoothly
      if (autoGeneration) {
        timerRef.current = setTimeout(() => {
          animationRequest.current = window.requestAnimationFrame(() => runSimulation());
        }, speed);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [boardSize, speed, cellSize]
  );

  useEffect(() => {
    // if speed changed cancel animation frame and animation control timer
    window.cancelAnimationFrame(animationRequest.current as number);
    clearTimeout(timerRef.current);
    if (isPlaying) {
      // if speed changed during simulation, debounce and
      clearTimeout(speedTimerRef.current);
      speedTimerRef.current = setTimeout(runSimulation, 300);
    }

    return () => {
      window.cancelAnimationFrame(animationRequest.current as number);
      clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speed]);

  useEffect(() => {
    if (isPlaying) {
      runSimulation();
    } else {
      window.cancelAnimationFrame(animationRequest.current as number);
      clearTimeout(timerRef.current);
    }

    return () => {
      window.cancelAnimationFrame(animationRequest.current as number);
      clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying]);


  const clearBoard = useCallback(() => {
    clear();
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext("2d") as CanvasRenderingContext2D;
      drawEmptyGrid(context, boardSize, cellSize);
    }
  }, [boardSize, clear, cellSize]);

  return (
    <Layout style={{ height: "100%" }}>
      <NavBar canvasRef={canvasRef} />
      <ContentContainer>
        <GameWrapper>
          <CardsWrapper>
            <BoardSettings canvasRef={canvasRef} />
            <InteractionControls />
          </CardsWrapper>
          <Game>
            <CanvasGrid canvasRef={canvasRef} canvasRedraw={clearBoard}/>
            <ControlsPanel clearBoard={clearBoard} generateNext={() => runSimulation(false)} canvasRef={canvasRef} />
          </Game>
        </GameWrapper>
        <RulesDrawer />
      </ContentContainer>
    </Layout>
  );
}

export default App;
