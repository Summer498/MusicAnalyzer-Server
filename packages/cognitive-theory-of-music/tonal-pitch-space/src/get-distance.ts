import { RomanChord } from "@music-analyzer/roman-chord/src/roman-chord";
import { regionDistance } from "./region-distance";
import { tonicDistance } from "./tonic-distance";
import { basicSpaceDistance } from "./basic-space-distance";

export const getDistance = (
  src_chord_string: RomanChord,
  dst_chord_string: RomanChord,
): number => {
  const src = src_chord_string;
  const dst = dst_chord_string;
  const region_dist = regionDistance(src.scale, dst.scale);
  const tonic_dist = tonicDistance(src.chord, dst.chord);
  const basic_space_dist = basicSpaceDistance(src, dst);
  return region_dist + tonic_dist + basic_space_dist;
};
