import { _Chord } from "@music-analyzer/tonal-objects";
import { ChordRomanModel } from "./chord-roman-model";
import { ChordRomanView } from "./chord-roman-view";
import { MVCController } from "@music-analyzer/view";

export class ChordRomanController extends MVCController {
  readonly model: ChordRomanModel;
  readonly view: ChordRomanView;
  constructor(model: ChordRomanModel) {
    super();
    this.model = model;
    this.view = new ChordRomanView(this.model);
  }
}
