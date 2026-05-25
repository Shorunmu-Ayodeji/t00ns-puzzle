export const GRID_SIZE = 3;
export const TILE_COUNT = GRID_SIZE * GRID_SIZE;

export type Tiles = number[];

export function createSolvedTiles(): Tiles {
  return Array.from({ length: TILE_COUNT }, (_, i) => i);
}

export function shuffleTiles(): Tiles {
  const tiles = createSolvedTiles();
  for (let i = tiles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
  }
  return tiles;
}

export function swapTiles(tiles: Tiles, a: number, b: number): Tiles {
  const next = tiles.slice();
  [next[a], next[b]] = [next[b], next[a]];
  return next;
}

export function isSolved(tiles: Tiles): boolean {
  for (let i = 0; i < tiles.length; i++) {
    if (tiles[i] !== i) return false;
  }
  return true;
}

export function backgroundPositionFor(tileValue: number): string {
  const row = Math.floor(tileValue / GRID_SIZE);
  const col = tileValue % GRID_SIZE;
  const step = 100 / (GRID_SIZE - 1);
  return `${col * step}% ${row * step}%`;
}
