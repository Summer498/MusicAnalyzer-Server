import { SerializedTimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";

const m3 = 3
class ImplicationRange {
  constructor(
    readonly inf: number,
    readonly sup: number,
    readonly over: number,
  ) { }
}

const getImplication = (
  a: ImplicationRange,
  b: ImplicationRange
) => new ImplicationRange(
  a.inf + b.inf,
  a.sup + b.sup,
  a.over + b.over
);

const inverse = (b: ImplicationRange) => new ImplicationRange(-b.inf, -b.sup, -b.over);

function getImplicationRange(initial: number) {
  const A = new ImplicationRange(
    (Math.abs(initial) - m3) / 2,
    Math.abs(initial),
    Math.abs(initial) + m3,
  );
  const B = new ImplicationRange(
    (Math.abs(initial) - m3) / 2,
    m3,
    0,
  );
  return (Math.abs(initial) < 6) ? { A, B } : { A, B: inverse(B) };
}

export function buildIRGravity(
  h_melodies: SerializedTimeAndAnalyzedMelody[][],
) {
  const layers = h_melodies.map((melodies, l) => {
    const N = melodies.length;
    for (let i = 0; i < N; i++) {
      const begin = melodies[i];
      const formation = melodies[i + 1];
      const realization = melodies[i + 2];
      
    }
  })
}