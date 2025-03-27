import { getDistance } from "@music-analyzer/tonal-pitch-space";
import { getKeysIncludeTheChord } from "@music-analyzer/tonal-pitch-space";
import { getScale, Scale } from "@music-analyzer/tonal-objects";
import { RomanChord } from "@music-analyzer/roman-chord";
import { dynamicLogViterbi } from "@music-analyzer/graph";
import { Compare } from "@music-analyzer/math/src/reduction/compare";
import { getChord } from "./get-chord"; 

export class ChordProgression {
  readonly lead_sheet_chords: string[];

  constructor(lead_sheet_chords: string[]) {
    this.lead_sheet_chords = lead_sheet_chords.map(e => getChord(e).name);
  }
  getStatesOnTime(t: number) {
    const chord = getChord(this.lead_sheet_chords[t]);
    const candidate_scales = getKeysIncludeTheChord(chord); // 候補がない時, ここが空配列になる
    if (candidate_scales.length === 0) {
      return [getScale("")];
    }
    return candidate_scales;
  }

  getDistanceOfStates(t1: number, t2: number, scale1: Scale, scale2: Scale) {
    if (scale1.empty) { console.warn("empty scale received"); return 0; }
    if (scale2.empty) { console.warn("empty scale received"); return 0; }

    return getDistance(
      new RomanChord(scale1, getChord(this.lead_sheet_chords[t1])),
      new RomanChord(scale2, getChord(this.lead_sheet_chords[t2])),
    );
  }

  getMinimumPath() {
    return dynamicLogViterbi(
      this.getStatesOnTime.bind(this),
      [],
      this.getDistanceOfStates.bind(this),
      e => 0,
      this.lead_sheet_chords,
      Compare.findMin,
    ).trace.map((e, i) => e.map(scale => new RomanChord(
      scale,
      getChord(this.lead_sheet_chords[i]),
    )));
  }
}
