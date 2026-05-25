"use client";

import { useEffect, useState } from "react";
import {
  GRID_SIZE,
  Tiles,
  backgroundPositionFor,
  createSolvedTiles,
  isSolved,
  shuffleTiles,
  swapTiles,
} from "@/lib/puzzle";

const IMAGE_URL = "/puzzle.jpg";

export default function PuzzleBoard() {
  const [tiles, setTiles] = useState<Tiles>(createSolvedTiles);
  const [selected, setSelected] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [imageOk, setImageOk] = useState(true);

  useEffect(() => {
    setTiles(shuffleTiles());
    setMounted(true);

    const img = new window.Image();
    img.onerror = () => setImageOk(false);
    img.src = IMAGE_URL;
  }, []);

  const solved = mounted && isSolved(tiles);

  function handleTileClick(index: number) {
    if (solved) return;
    if (selected === null) {
      setSelected(index);
      return;
    }
    if (selected === index) {
      setSelected(null);
      return;
    }
    setTiles((prev) => swapTiles(prev, selected, index));
    setMoves((m) => m + 1);
    setSelected(null);
  }

  function handlePlayAgain() {
    setTiles(shuffleTiles());
    setSelected(null);
    setMoves(0);
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {!imageOk && (
        <div className="rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-800">
          Could not load <code>{IMAGE_URL}</code> — drop a puzzle image in <code>public/</code>.
        </div>
      )}
      <div className="text-xs text-neutral-500">M0ves: {moves}</div>

      <div className="relative w-[min(90vw,400px)] aspect-square">
        <div
          className="grid h-full w-full gap-[2px] rounded-md bg-neutral-300 p-[2px] shadow-sm"
          style={{
            gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
          }}
        >
          {tiles.map((tileValue, index) => {
            const isSelected = selected === index;
            return (
              <button
                key={index}
                type="button"
                onClick={() => handleTileClick(index)}
                aria-label={`Tile at position ${index + 1}`}
                className={[
                  "relative overflow-hidden bg-neutral-200 transition-transform duration-150",
                  "hover:scale-[0.98] hover:brightness-110",
                  "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
                  isSelected
                    ? "ring-2 ring-blue-500 ring-offset-1 brightness-110"
                    : "",
                ].join(" ")}
                style={{
                  backgroundImage: `url(${IMAGE_URL})`,
                  backgroundSize: `${GRID_SIZE * 100}% ${GRID_SIZE * 100}%`,
                  backgroundPosition: backgroundPositionFor(tileValue),
                  backgroundRepeat: "no-repeat",
                }}
              />
            );
          })}
        </div>

        {solved && (
          <div className="absolute inset-0 flex items-center justify-center rounded-md bg-black/60 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-3 rounded-lg bg-white px-6 py-5 shadow-lg">
              <div className="text-lg font-semibold">🎉 Puzzle C0mplete</div>
              <div className="text-xs text-neutral-500">
                S0lved in {moves} {moves === 1 ? "m0ve" : "m0ves"}
              </div>
              <button
                type="button"
                onClick={handlePlayAgain}
                className="mt-1 rounded-md bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
              >
                Play Again
              </button>
            </div>
          </div>
        )}
      </div>

      {!solved && (
        <button
          type="button"
          onClick={handlePlayAgain}
          className="rounded-md border border-neutral-300 bg-white px-4 py-1.5 text-sm font-medium text-neutral-700 shadow-sm transition hover:bg-neutral-50 active:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
        >
          Shuffle
        </button>
      )}
    </div>
  );
}
