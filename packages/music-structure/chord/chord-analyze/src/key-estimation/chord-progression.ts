import { getScale, Scale } from "@music-analyzer/tonal-objects";
import { RomanChord } from "@music-analyzer/roman-chord";
import { getChord } from "./get-chord";
import { getDistance, getKeysIncludeTheChord } from "@music-analyzer/tonal-pitch-space";
import { dynamicLogViterbi } from "@music-analyzer/graph";
import { Compare } from "@music-analyzer/math";

export interface ChordProgression {
  lead_sheet_chords: string[];
  getStatesOnTime(t: number): Scale[];
  getDistanceOfStates(t1: number, t2: number, scale1: Scale, scale2: Scale): number;
  getMinimumPath(): RomanChord[][];
}

export const createChordProgression = (lead_sheet_chords: string[]): ChordProgression => {
  const chords = lead_sheet_chords.map(e => getChord(e).name);

  const getStatesOnTime = (t: number) => {
    const chord = getChord(chords[t]);
    const candidate_scales = getKeysIncludeTheChord(chord);
    if (candidate_scales.length === 0) { return [getScale("")]; }
    return candidate_scales;
  };

  const getDistanceOfStates = (t1: number, t2: number, scale1: Scale, scale2: Scale) => {
    if (scale1.empty) { console.warn("empty scale received"); return 0; }
    if (scale2.empty) { console.warn("empty scale received"); return 0; }
    return getDistance(
      new RomanChord(scale1, getChord(chords[t1])),
      new RomanChord(scale2, getChord(chords[t2])),
    );
  };

  const getMinimumPath = () =>
    dynamicLogViterbi(
      getStatesOnTime,
      [],
      getDistanceOfStates,
      () => 0,
      chords,
      Compare.findMin,
    ).trace.map((e, i) => e.map(scale => new RomanChord(
      scale,
      getChord(chords[i]),
    )));

  return { lead_sheet_chords: chords, getStatesOnTime, getDistanceOfStates, getMinimumPath };
};
