import { mod } from "@music-analyzer/math/src/basic-function/mod";
import { getChroma } from "@music-analyzer/tonal-objects/src/note/chroma";
import { Scale } from "@music-analyzer/tonal-objects/src/scale/scale";

const regionDistanceInChromaNumber = (src: number, dst: number) => Math.abs(mod((dst - src) * 7 + 6, 12) - 6);
export const regionDistance = (src: Scale, dst: Scale) => {
  const src_chroma = getChroma(src.tonic);
  const dst_chroma = getChroma(dst.tonic);

  const region_dist = regionDistanceInChromaNumber(src_chroma, dst_chroma);
  return region_dist;
};
