import { TimeAndRomanAnalysis } from "./facade/chord-analyze";
import { Time } from "./facade/time";
import { Chord } from"./facade/tonal-object"
import { Scale } from"./facade/tonal-object"
import { getChord } from"./facade/tonal-object"
import { getScale } from"./facade/tonal-object"

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
