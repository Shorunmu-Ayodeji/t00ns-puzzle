"use client";

import { useEffect, useState } from "react";
import {
  LEVELS,
  MAX_LEVEL,
  Tiles,
  backgroundPositionFor,
  createSolvedTiles,
  getGridSize,
  isSolved,
  shuffleTiles,
  swapTiles,
} from "@/lib/puzzle";

const IMAGE_URL = "/puzzle.jpg";
const STORAGE_KEY = "t00ns-unlocked-level";

export default function PuzzleBoard() {
  const [level, setLevel] = useState(1);
  const [unlockedLevel, setUnlockedLevel] = useState(1);
  const [tiles, setTiles] = useState<Tiles>(() => createSolvedTiles(LEVELS[0]));
  const [selected, setSelected] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [imageOk, setImageOk] = useState(true);

  const gridSize = getGridSize(level);

  useEffect(() => {
    let startLevel = 1;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw === null ? NaN : parseInt(raw, 10);
      if (Number.isFinite(parsed)) {
        startLevel = Math.min(Math.max(parsed, 1), MAX_LEVEL);
      }
    } catch {
      // localStorage unavailable (private mode, etc.) — default to 1
    }
    setUnlockedLevel(startLevel);
    setTiles(shuffleTiles(LEVELS[0]));
    setMounted(true);

    const img = new window.Image();
    img.onerror = () => setImageOk(false);
    img.src = IMAGE_URL;
  }, []);

  const solved = mounted && isSolved(tiles);

  useEffect(() => {
    if (!solved) return;
    if (level === unlockedLevel && level < MAX_LEVEL) {
      const next = level + 1;
      setUnlockedLevel(next);
      try {
        localStorage.setItem(STORAGE_KEY, String(next));
      } catch {
        // ignore write failures
      }
    }
  }, [solved, level, unlockedLevel]);

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

  function changeLevel(n: number) {
    setLevel(n);
    setTiles(shuffleTiles(getGridSize(n)));
    setSelected(null);
    setMoves(0);
  }

  function handleReshuffle() {
    setTiles(shuffleTiles(gridSize));
    setSelected(null);
    setMoves(0);
  }

  function handleNextLevel() {
    if (level < MAX_LEVEL) changeLevel(level + 1);
  }

  function handleSelectLevel(n: number) {
    if (n > unlockedLevel) return;
    if (n === level) {
      handleReshuffle();
      return;
    }
    changeLevel(n);
  }

  const beatAll = solved && level === MAX_LEVEL;

  return (
    <div className="flex flex-col items-center gap-4">
      {!imageOk && (
        <div className="rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-800">
          Could not load <code>{IMAGE_URL}</code> — drop a puzzle image in{" "}
          <code>public/</code>.
        </div>
      )}

      <div className="flex items-center gap-1.5">
        {LEVELS.map((size, i) => {
          const n = i + 1;
          const isLocked = n > unlockedLevel;
          const isCurrent = n === level;
          return (
            <button
              key={n}
              type="button"
              disabled={isLocked}
              onClick={() => handleSelectLevel(n)}
              aria-pressed={isCurrent}
              aria-label={`Level ${n}, ${size} by ${size}${isLocked ? ", locked" : ""}`}
              className={[
                "flex h-9 w-9 items-center justify-center rounded-md text-sm font-semibold transition",
                "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1",
                isCurrent
                  ? "bg-blue-600 text-white shadow"
                  : isLocked
                    ? "cursor-not-allowed bg-neutral-200 text-neutral-400"
                    : "border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50",
              ].join(" ")}
            >
              {isLocked ? "🔒" : n}
            </button>
          );
        })}
      </div>

      <div className="text-xs text-neutral-500">
        Level {level} · {gridSize}×{gridSize} · M0ves: {moves}
      </div>

      <div className="relative w-[min(90vw,400px)] aspect-square">
        <div
          className="grid h-full w-full gap-[2px] rounded-md bg-neutral-300 p-[2px] shadow-sm"
          style={{
            gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${gridSize}, minmax(0, 1fr))`,
          }}
        >
          {tiles.map((tileValue, index) => {
            const isSelected = selected === index;
            return (
              <button
                key={index}
                type="button"
                onClick={() => handleTileClick(index)}
                aria-pressed={isSelected}
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
                  backgroundSize: `${gridSize * 100}% ${gridSize * 100}%`,
                  backgroundPosition: backgroundPositionFor(tileValue, gridSize),
                  backgroundRepeat: "no-repeat",
                }}
              />
            );
          })}
        </div>

        {solved && (
          <div className="absolute inset-0 flex items-center justify-center rounded-md bg-black/60 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-3 rounded-lg bg-white px-6 py-5 shadow-lg">
              <div className="text-center text-lg font-semibold">
                {beatAll
                  ? "🏆 All Levels C0mplete"
                  : `🎉 Level ${level} C0mplete`}
              </div>
              <div className="text-xs text-neutral-500">
                S0lved in {moves} {moves === 1 ? "m0ve" : "m0ves"}
              </div>
              <div className="mt-1 flex gap-2">
                {!beatAll && (
                  <button
                    type="button"
                    onClick={handleNextLevel}
                    className="rounded-md bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    Next Level
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleReshuffle}
                  className="rounded-md border border-neutral-300 bg-white px-4 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
                >
                  Play Again
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {!solved && (
        <button
          type="button"
          onClick={handleReshuffle}
          className="rounded-md border border-neutral-300 bg-white px-4 py-1.5 text-sm font-medium text-neutral-700 shadow-sm transition hover:bg-neutral-50 active:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
        >
          Shuffle
        </button>
      )}
    </div>
  );
}
