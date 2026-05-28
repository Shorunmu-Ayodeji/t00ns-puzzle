export const LEVELS = [3, 4, 5, 6, 7] as const;
export const MAX_LEVEL = LEVELS.length;

export type Tiles = number[];

export function getGridSize(level: number): number {
  return LEVELS[level - 1] ?? LEVELS[0];
}

export function createSolvedTiles(size: number): Tiles {
  return Array.from({ length: size * size }, (_, i) => i);
}

export function shuffleTiles(size: number): Tiles {
  const tiles = createSolvedTiles(size);
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

export function backgroundPositionFor(tileValue: number, size: number): string {
  const row = Math.floor(tileValue / size);
  const col = tileValue % size;
  const step = size === 1 ? 0 : 100 / (size - 1);
  return `${col * step}% ${row * step}%`;
}
