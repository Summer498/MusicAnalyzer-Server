import { mod } from "@music-analyzer/math";
import { Scale } from "@music-analyzer/tonal-objects";
import { chromaFromNonNull } from "@music-analyzer/tonal-objects";

const regionDistanceInChromaNumber = (src: number, dst: number) => Math.abs(mod((dst - src) * 7 + 6, 12) - 6);
export const regionDistance = (src: Scale, dst: Scale) => {
  const src_chroma = chromaFromNonNull(src.tonic);
  const dst_chroma = chromaFromNonNull(dst.tonic);

  const region_dist = regionDistanceInChromaNumber(src_chroma, dst_chroma);
  return region_dist;
};
