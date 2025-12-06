import { Grid, Direction } from '../types';

export const getEmptyGrid = (): Grid => [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

export const getEmptyCoordinates = (grid: Grid): { r: number; c: number }[] => {
  const coords = [];
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (grid[r][c] === 0) {
        coords.push({ r, c });
      }
    }
  }
  return coords;
};

export const addRandomTile = (grid: Grid): Grid => {
  const emptyCoords = getEmptyCoordinates(grid);
  if (emptyCoords.length === 0) return grid;

  const { r, c } = emptyCoords[Math.floor(Math.random() * emptyCoords.length)];
  const newGrid = copyGrid(grid);
  newGrid[r][c] = Math.random() < 0.9 ? 2 : 4;
  return newGrid;
};

const copyGrid = (grid: Grid): Grid => grid.map((row) => [...row]);

const filterZero = (row: number[]) => row.filter((num) => num !== 0);

const slideRow = (row: number[]): { newRow: number[]; score: number } => {
  let filtered = filterZero(row);
  let score = 0;

  for (let i = 0; i < filtered.length - 1; i++) {
    if (filtered[i] === filtered[i + 1]) {
      filtered[i] *= 2;
      score += filtered[i];
      filtered[i + 1] = 0;
    }
  }

  filtered = filterZero(filtered);
  while (filtered.length < 4) {
    filtered.push(0);
  }

  return { newRow: filtered, score };
};

export const moveGrid = (
  grid: Grid,
  direction: Direction
): { grid: Grid; score: number; moved: boolean } => {
  let newGrid = copyGrid(grid);
  let score = 0;
  let moved = false;

  if (direction === 'LEFT') {
    for (let r = 0; r < 4; r++) {
      const { newRow, score: rowScore } = slideRow(newGrid[r]);
      if (JSON.stringify(newGrid[r]) !== JSON.stringify(newRow)) moved = true;
      newGrid[r] = newRow;
      score += rowScore;
    }
  } else if (direction === 'RIGHT') {
    for (let r = 0; r < 4; r++) {
      let row = [...newGrid[r]].reverse();
      const { newRow, score: rowScore } = slideRow(row);
      const reversedRow = newRow.reverse();
      if (JSON.stringify(newGrid[r]) !== JSON.stringify(reversedRow)) moved = true;
      newGrid[r] = reversedRow;
      score += rowScore;
    }
  } else if (direction === 'UP') {
    for (let c = 0; c < 4; c++) {
      let col = [newGrid[0][c], newGrid[1][c], newGrid[2][c], newGrid[3][c]];
      const { newRow, score: rowScore } = slideRow(col);
      for (let r = 0; r < 4; r++) {
        if (newGrid[r][c] !== newRow[r]) moved = true;
        newGrid[r][c] = newRow[r];
      }
      score += rowScore;
    }
  } else if (direction === 'DOWN') {
    for (let c = 0; c < 4; c++) {
      let col = [newGrid[0][c], newGrid[1][c], newGrid[2][c], newGrid[3][c]].reverse();
      const { newRow, score: rowScore } = slideRow(col);
      const reversedCol = newRow.reverse();
      for (let r = 0; r < 4; r++) {
        if (newGrid[r][c] !== reversedCol[r]) moved = true;
        newGrid[r][c] = reversedCol[r];
      }
      score += rowScore;
    }
  }

  return { grid: newGrid, score, moved };
};

export const checkGameOver = (grid: Grid): boolean => {
  // Check for zeros
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (grid[r][c] === 0) return false;
    }
  }
  // Check for possible merges
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (c < 3 && grid[r][c] === grid[r][c + 1]) return false;
      if (r < 3 && grid[r][c] === grid[r + 1][c]) return false;
    }
  }
  return true;
};
