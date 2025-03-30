import { Time } from "./facade";
import { Chord } from"./facade"
import { Scale } from"./facade"
import { MVVM_Model } from "./facade";
import { RequiredByChordPartModel } from "./facade";

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