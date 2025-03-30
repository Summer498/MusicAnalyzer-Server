import { TimeAndRomanAnalysis } from "./facade";
import { Time } from "./facade";
import { Chord } from"./facade"
import { Scale } from"./facade"
import { getChord } from"./facade"
import { getScale } from"./facade"

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
