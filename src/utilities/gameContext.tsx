/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { ILiveCells } from "../types";
import { calcCellSize } from "./grid";

export interface IGameContext {
  isPlaying: boolean;
  boardSize: number;
  speed: number;
  areRulesOpen: boolean;
  liveCells: ILiveCells;
  history: ILiveCells[];
  cellSize: number;
  generation: number;
  setHistory: React.Dispatch<React.SetStateAction<ILiveCells[]>>;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  setBoardSize: React.Dispatch<React.SetStateAction<number>>;
  setSpeed: React.Dispatch<React.SetStateAction<number>>;
  setAreRulesOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setLiveCells: React.Dispatch<React.SetStateAction<ILiveCells>>;
  setGeneration: React.Dispatch<React.SetStateAction<number>>;
  reset: (redrawBoard?: () => void) => void;
  clear: () => void;
}

export const GameContext = createContext<IGameContext | null>(null);

export const GameProvider = (props: { children: React.JSX.Element }) => {
  const { children } = props;
  const [isPlaying, setIsPlaying] = useState(false);
  const [boardSize, setBoardSize] = useState(40);
  const [speed, setSpeed] = useState(200);
  const [areRulesOpen, setAreRulesOpen] = useState(true);
  const [generation, setGeneration] = useState(1);
  const [liveCells, setLiveCells] = useState<ILiveCells>(new Set());
  const [history, setHistory] = useState<ILiveCells[]>([new Set()]);

  const cellSize = useMemo(() => calcCellSize(boardSize), [boardSize]);

  const reset = useCallback(
    (redrawBoard?: () => void) => {
      setIsPlaying(false);
      if (redrawBoard) {
        setLiveCells(history[0] || new Set());
        redrawBoard();
      }
      setHistory([]);
      setGeneration(1);
    },
    [history]
  );

  const clear = useCallback(() => {
    setIsPlaying(false);
    setLiveCells(new Set([]));
    setHistory([]);
    setGeneration(1);
  }, []);

  return (
    <GameContext.Provider
      value={{
        cellSize,
        isPlaying,
        boardSize,
        speed,
        areRulesOpen,
        liveCells,
        history,
        generation,
        setHistory,
        setGeneration,
        setBoardSize,
        setIsPlaying,
        setAreRulesOpen,
        setSpeed,
        reset,
        setLiveCells,
        clear,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = (): IGameContext => {
  const context = useContext(GameContext);

  return context as IGameContext;
};
