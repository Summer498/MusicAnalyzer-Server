import { Time } from "./facade/time";
import { Chord } from"./facade/tonal-object"
import { Scale } from"./facade/tonal-object"
import { MVVM_Model } from "./facade/view";
import { RequiredByChordPartModel } from "./facade/r-model";

export abstract class ChordPartModel
  extends MVVM_Model {
  readonly time: Time;
  readonly chord: Chord
  readonly scale: Scale
  readonly roman: string
  abstract readonly tonic: string
  constructor(e: RequiredByChordPartModel) {
    super()
    this.time = e.time;
    this.chord = e.chord;
    this.scale = e.scale;
    this.roman = e.roman
  }
}