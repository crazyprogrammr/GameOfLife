export type ILiveCells = Set<string>;

export type Preset = {
  boardSize: number;
  speed?: number;
  liveCells: string[];
};
