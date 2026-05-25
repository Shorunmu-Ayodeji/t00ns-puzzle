import PuzzleBoard from "@/components/PuzzleBoard";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-6">
      <h1 className="text-2xl font-semibold tracking-tight">t00ns puzzle</h1>
      <p className="text-sm text-neutral-500">
        Click tw0 tiles t0 swap them. Rebuild the image.
      </p>
      <PuzzleBoard />
    </main>
  );
}
