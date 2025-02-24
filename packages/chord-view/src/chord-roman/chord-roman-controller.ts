import { _Chord } from "@music-analyzer/tonal-objects";
import { MVCController } from "@music-analyzer/view";
import { ChordRomanModel } from "./chord-roman-model";
import { ChordRomanView } from "./chord-roman-view";

export class ChordRomanController extends MVCController {
  readonly view: ChordRomanView;
  constructor(
    readonly model: ChordRomanModel,
  ) {
    super();
    this.view = new ChordRomanView(this.model);
  }
}
