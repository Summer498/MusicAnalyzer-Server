import { RequiredByChordKeyModel } from "./r-chord-key-model";
import { ChordPartModel } from "./chord-part-model";

export class ChordKeyModel 
  extends ChordPartModel {
  readonly tonic: string;
  constructor(e: RequiredByChordKeyModel) {
    super(e);
    this.tonic = this.scale.tonic || "";
  }
}
