import { Time } from "@music-analyzer/time-and/src/time";
import { Chord } from "@music-analyzer/tonal-objects/src/chord/chord";
import { Scale } from "@music-analyzer/tonal-objects/src/scale/scale";
import { MVVM_Model } from "@music-analyzer/view/src/mvvm/model";
import { RequiredByChordPartModel } from "./r-chord-part-model";

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