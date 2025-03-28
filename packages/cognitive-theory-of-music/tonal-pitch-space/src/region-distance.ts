import { mod } from "@music-analyzer/math/src/basic-function/mod";
import { Scale } from "@music-analyzer/tonal-objects/src/scale/scale";
import { chromaFromNonNull } from "@music-analyzer/tonal-objects/src/note/chroma-from-non-null";

const regionDistanceInChromaNumber = (src: number, dst: number) => Math.abs(mod((dst - src) * 7 + 6, 12) - 6);
export const regionDistance = (src: Scale, dst: Scale) => {
  const src_chroma = chromaFromNonNull(src.tonic);
  const dst_chroma = chromaFromNonNull(dst.tonic);

  const region_dist = regionDistanceInChromaNumber(src_chroma, dst_chroma);
  return region_dist;
};
