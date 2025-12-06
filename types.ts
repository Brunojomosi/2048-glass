export type Grid = number[][];

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export interface GameState {
  grid: Grid;
  score: number;
  bestScore: number;
  gameOver: boolean;
  won: boolean;
}

export interface AIResponse {
  move: Direction;
  reason: string;
}
