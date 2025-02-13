import { _Chord } from "@music-analyzer/tonal-objects";
import { ChordRomanModel } from "./chord-roman-model";
import { ChordRomanView } from "./chord-roman-view";

export class ChordRomanController {
  readonly model: ChordRomanModel;
  readonly view: ChordRomanView;
  constructor(model: ChordRomanModel) {
    this.model = model;
    this.view = new ChordRomanView(this.model);
  }
}
