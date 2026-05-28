import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("@/lib/puzzle", async () => {
  const actual =
    await vi.importActual<typeof import("@/lib/puzzle")>("@/lib/puzzle");
  return {
    ...actual,
    // Near-solved: swap the last two tiles, so the board can be solved
    // by a single swap of the last two positions.
    shuffleTiles: (size: number) => {
      const tiles = actual.createSolvedTiles(size);
      const last = tiles.length - 1;
      [tiles[last], tiles[last - 1]] = [tiles[last - 1], tiles[last]];
      return tiles;
    },
  };
});

import PuzzleBoard from "./PuzzleBoard";

async function solveCurrentBoard(size: number) {
  const user = userEvent.setup();
  const last = size * size;
  await user.click(screen.getByLabelText(`Tile at position ${last - 1}`));
  await user.click(screen.getByLabelText(`Tile at position ${last}`));
}

describe("PuzzleBoard - initial state", () => {
  it("only level 1 is unlocked on first load", () => {
    render(<PuzzleBoard />);
    expect(screen.getByRole("button", { name: /Level 1/ })).not.toBeDisabled();
    expect(screen.getByRole("button", { name: /Level 2/ })).toBeDisabled();
    expect(screen.getByRole("button", { name: /Level 5/ })).toBeDisabled();
  });

  it("level 1 is marked as the current selection via aria-pressed", () => {
    render(<PuzzleBoard />);
    expect(screen.getByRole("button", { name: /Level 1/ })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: /Level 2/ })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });
});

describe("PuzzleBoard - locked levels", () => {
  it("clicking a locked level does not change the current level", async () => {
    const user = userEvent.setup();
    render(<PuzzleBoard />);
    const locked = screen.getByRole("button", { name: /Level 5/ });
    await user.click(locked);
    expect(screen.getByRole("button", { name: /Level 1/ })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });
});

describe("PuzzleBoard - progression", () => {
  it("solving level 1 shows the win modal, unlocks level 2, and persists it", async () => {
    render(<PuzzleBoard />);
    await solveCurrentBoard(3);

    expect(await screen.findByText(/Level 1 C0mplete/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Level 2/ })).not.toBeDisabled();
    expect(localStorage.getItem("t00ns-unlocked-level")).toBe("2");
  });

  it("clicking Next Level advances to level 2 with a 4x4 board", async () => {
    const user = userEvent.setup();
    render(<PuzzleBoard />);
    await solveCurrentBoard(3);

    await user.click(screen.getByRole("button", { name: "Next Level" }));

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /Level 2/ }),
      ).toHaveAttribute("aria-pressed", "true");
    });
    expect(screen.getByText(/4×4/)).toBeInTheDocument();
    // Level 2's 4x4 board has 16 tiles
    expect(screen.getByLabelText("Tile at position 16")).toBeInTheDocument();
  });

  it("Play Again in the modal reshuffles the current level instead of advancing", async () => {
    const user = userEvent.setup();
    render(<PuzzleBoard />);
    await solveCurrentBoard(3);

    await user.click(screen.getByRole("button", { name: "Play Again" }));

    expect(screen.queryByText(/C0mplete/)).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Level 1/ })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });
});

describe("PuzzleBoard - final level", () => {
  it("beating level 5 shows 'All Levels C0mplete' with no Next Level button", async () => {
    localStorage.setItem("t00ns-unlocked-level", "5");
    const user = userEvent.setup();
    render(<PuzzleBoard />);

    await user.click(screen.getByRole("button", { name: /Level 5/ }));
    await solveCurrentBoard(7);

    expect(
      await screen.findByText(/All Levels C0mplete/),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Next Level" }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Play Again" }),
    ).toBeInTheDocument();
  });
});

describe("PuzzleBoard - persistence", () => {
  it("restores unlocked level from localStorage on mount", () => {
    localStorage.setItem("t00ns-unlocked-level", "3");
    render(<PuzzleBoard />);

    expect(screen.getByRole("button", { name: /Level 1/ })).not.toBeDisabled();
    expect(screen.getByRole("button", { name: /Level 3/ })).not.toBeDisabled();
    expect(screen.getByRole("button", { name: /Level 4/ })).toBeDisabled();
  });

  it("clamps a corrupted localStorage value to the valid range", () => {
    localStorage.setItem("t00ns-unlocked-level", "999");
    render(<PuzzleBoard />);
    expect(screen.getByRole("button", { name: /Level 5/ })).not.toBeDisabled();
  });

  it("ignores a non-numeric localStorage value and defaults to level 1", () => {
    localStorage.setItem("t00ns-unlocked-level", "garbage");
    render(<PuzzleBoard />);
    expect(screen.getByRole("button", { name: /Level 2/ })).toBeDisabled();
  });
});
