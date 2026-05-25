import { describe, it, expect } from "vitest";
import {
  GRID_SIZE,
  TILE_COUNT,
  backgroundPositionFor,
  createSolvedTiles,
  isSolved,
  shuffleTiles,
  swapTiles,
} from "./puzzle";

describe("createSolvedTiles", () => {
  it("returns 9 tiles in order 0..8", () => {
    expect(createSolvedTiles()).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
  });

  it("has length TILE_COUNT", () => {
    expect(createSolvedTiles()).toHaveLength(TILE_COUNT);
  });
});

describe("isSolved", () => {
  it("true for the identity permutation", () => {
    expect(isSolved([0, 1, 2, 3, 4, 5, 6, 7, 8])).toBe(true);
  });

  it("false when any pair is swapped", () => {
    expect(isSolved([1, 0, 2, 3, 4, 5, 6, 7, 8])).toBe(false);
    expect(isSolved([0, 1, 2, 3, 4, 5, 6, 8, 7])).toBe(false);
  });

  it("false for a fully reversed array", () => {
    expect(isSolved([8, 7, 6, 5, 4, 3, 2, 1, 0])).toBe(false);
  });
});

describe("swapTiles", () => {
  it("swaps two indices and returns a new array", () => {
    const input = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    const result = swapTiles(input, 0, 8);
    expect(result).toEqual([8, 1, 2, 3, 4, 5, 6, 7, 0]);
    expect(input).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
    expect(result).not.toBe(input);
  });

  it("is a no-op when both indices are equal", () => {
    expect(swapTiles([0, 1, 2, 3, 4, 5, 6, 7, 8], 4, 4)).toEqual([
      0, 1, 2, 3, 4, 5, 6, 7, 8,
    ]);
  });
});

describe("shuffleTiles", () => {
  it("produces an array of length TILE_COUNT", () => {
    expect(shuffleTiles()).toHaveLength(TILE_COUNT);
  });

  it("is a permutation of 0..8 (no duplicates, no missing values)", () => {
    const tiles = shuffleTiles();
    expect([...tiles].sort((a, b) => a - b)).toEqual([
      0, 1, 2, 3, 4, 5, 6, 7, 8,
    ]);
  });
});

describe("backgroundPositionFor", () => {
  it("maps the top-left tile to 0% 0%", () => {
    expect(backgroundPositionFor(0)).toBe("0% 0%");
  });

  it("maps the bottom-right tile to 100% 100%", () => {
    expect(backgroundPositionFor(TILE_COUNT - 1)).toBe("100% 100%");
  });

  it("maps the center tile to 50% 50%", () => {
    expect(backgroundPositionFor(4)).toBe("50% 50%");
  });

  it("maps the top-right tile to 100% 0%", () => {
    expect(backgroundPositionFor(GRID_SIZE - 1)).toBe("100% 0%");
  });

  it("maps the bottom-left tile to 0% 100%", () => {
    expect(backgroundPositionFor(TILE_COUNT - GRID_SIZE)).toBe("0% 100%");
  });
});
