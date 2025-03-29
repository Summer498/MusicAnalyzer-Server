import { RequiredByChordRomanModel } from "./r-chord-roman-model";
import { ChordPartModel } from "./chord-part-model";

export class ChordRomanModel
  extends ChordPartModel {
  readonly tonic: string;
  constructor(e: RequiredByChordRomanModel) {
    super(e);
    this.tonic = e.chord.tonic || "";
  }
}
