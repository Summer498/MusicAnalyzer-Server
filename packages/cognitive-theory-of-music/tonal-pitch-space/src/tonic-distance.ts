import { mod } from "@music-analyzer/math/src/basic-function/mod";
import { assertNonNullable as NN } from "@music-analyzer/stdlib/src/assertion/not-null-like";
import { Chord } from "@music-analyzer/tonal-objects/src/chord/chord";
import { getIntervalDegree } from "@music-analyzer/tonal-objects/src/interval/interval-degree";

const _tonicDistanceInChromaNumber = (src: number, dst: number) => Math.abs(mod((dst - src) * 3 + 3, 7) - 3);
export const tonicDistance = (src: Chord, dst: Chord) => {
  const interval = getIntervalDegree(
    NN(src.tonic),
    NN(dst.tonic),
  );
  const dist_in_circle_of_3rd = mod((interval - 1) * 3, 7);
  return Math.min(dist_in_circle_of_3rd, 7 - dist_in_circle_of_3rd);
};
