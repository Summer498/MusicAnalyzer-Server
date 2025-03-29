import { TimeAndRomanAnalysis } from "@music-analyzer/chord-analyze/src/chord-analyze/time-and-roman-analysis";
import { Time } from "@music-analyzer/time-and/src/time";
import { Chord } from "@music-analyzer/tonal-objects/src/chord/chord";
import { Scale } from "@music-analyzer/tonal-objects/src/scale/scale";
import { getChord } from "@music-analyzer/tonal-objects/src/chord/get";
import { getScale } from "@music-analyzer/tonal-objects/src/scale/get";

export class RequiredByChordPartModel {
  readonly time: Time
  readonly chord: Chord
  readonly scale: Scale
  readonly roman: string
  constructor(e:TimeAndRomanAnalysis){
    this.time = e.time
    this.chord = getChord(e.chord)
    this.scale = getScale(e.scale)
    this.roman = e.scale
  }
}
