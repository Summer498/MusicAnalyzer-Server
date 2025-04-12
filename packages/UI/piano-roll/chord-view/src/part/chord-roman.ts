import { ChordPartText } from "./chord-part-text";
import { RequiredByChordRomanModel } from "../r-model";
import { ChordRomanModel } from "../model";
import { ChordRomanView } from "../view";
import { chord_name_margin, chord_text_size } from "../chord-view-params";

export class ChordRoman
  extends ChordPartText<ChordRomanModel, ChordRomanView> {
  y: number;
  constructor(
    e: RequiredByChordRomanModel,
  ) {
    const model = new ChordRomanModel(e);
    super(model, new ChordRomanView(model));
    this.y = this.getBottom() + (chord_text_size + chord_name_margin);
    this.updateX();
    this.updateY();
  }
  onWindowResized() {
    this.updateX();
  }
}
