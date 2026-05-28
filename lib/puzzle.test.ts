import { describe, it, expect } from "vitest";
import {
  LEVELS,
  MAX_LEVEL,
  backgroundPositionFor,
  createSolvedTiles,
  getGridSize,
  isSolved,
  shuffleTiles,
  swapTiles,
} from "./puzzle";

describe("LEVELS", () => {
  it("has 5 entries, monotonically increasing", () => {
    expect(LEVELS).toHaveLength(5);
    expect(MAX_LEVEL).toBe(5);
    for (let i = 1; i < LEVELS.length; i++) {
      expect(LEVELS[i]).toBeGreaterThan(LEVELS[i - 1]);
    }
  });
});

describe("getGridSize", () => {
  it("maps level 1..5 to LEVELS values", () => {
    expect(getGridSize(1)).toBe(LEVELS[0]);
    expect(getGridSize(5)).toBe(LEVELS[4]);
  });

  it("falls back to the first level for out-of-range input", () => {
    expect(getGridSize(0)).toBe(LEVELS[0]);
    expect(getGridSize(99)).toBe(LEVELS[0]);
  });
});

describe("createSolvedTiles", () => {
  it("returns size*size tiles in order for a 3x3", () => {
    expect(createSolvedTiles(3)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
  });

  it("returns 49 tiles for a 7x7", () => {
    const tiles = createSolvedTiles(7);
    expect(tiles).toHaveLength(49);
    expect(tiles[0]).toBe(0);
    expect(tiles[48]).toBe(48);
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
  it("produces an array of length size*size for every level", () => {
    for (const size of LEVELS) {
      expect(shuffleTiles(size)).toHaveLength(size * size);
    }
  });

  it("is a permutation of 0..size*size-1 (no duplicates, no missing)", () => {
    for (const size of LEVELS) {
      const tiles = shuffleTiles(size);
      const sorted = [...tiles].sort((a, b) => a - b);
      const expected = Array.from({ length: size * size }, (_, i) => i);
      expect(sorted).toEqual(expected);
    }
  });
});

describe("backgroundPositionFor", () => {
  it("maps the top-left tile to 0% 0% regardless of size", () => {
    for (const size of LEVELS) {
      expect(backgroundPositionFor(0, size)).toBe("0% 0%");
    }
  });

  it("maps the bottom-right tile to 100% 100% regardless of size", () => {
    for (const size of LEVELS) {
      expect(backgroundPositionFor(size * size - 1, size)).toBe("100% 100%");
    }
  });

  it("maps the center of a 3x3 to 50% 50%", () => {
    expect(backgroundPositionFor(4, 3)).toBe("50% 50%");
  });

  it("maps the top-right of a 3x3 to 100% 0%", () => {
    expect(backgroundPositionFor(2, 3)).toBe("100% 0%");
  });

  it("maps the bottom-left of a 3x3 to 0% 100%", () => {
    expect(backgroundPositionFor(6, 3)).toBe("0% 100%");
  });
});
