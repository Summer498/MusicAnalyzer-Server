import { chord_name_margin } from "../chord-view-params";
import { chord_text_size } from "../chord-view-params";
import { ChordKeyModel } from "../model";
import { RequiredByChordKeyModel } from "../r-model";
import { ChordKeyView } from "../view";
import { ChordPartText } from "./chord-part-text";

export class ChordKey
  extends ChordPartText<ChordKeyModel, ChordKeyView> {
  y: number;
  constructor(
    e: RequiredByChordKeyModel,
  ) {
    const model = new ChordKeyModel(e);
    super(model, new ChordKeyView(model));
    this.y = this.getBottom() + (chord_text_size + chord_name_margin);
    this.updateX();
    this.updateY();
  }
  onWindowResized() {
    this.updateX();
  }
}
