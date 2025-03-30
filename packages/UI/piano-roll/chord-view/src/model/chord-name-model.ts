import { RequiredByChordNameModel } from "./facade";
import { ChordPartModel } from "./chord-part-model";

export class ChordNameModel 
  extends ChordPartModel {
  readonly tonic: string;
  readonly name: string;
  constructor(e: RequiredByChordNameModel){
    super(e);
    this.tonic = this.chord.tonic || "";
    this.name = this.chord.name;
  }
}
