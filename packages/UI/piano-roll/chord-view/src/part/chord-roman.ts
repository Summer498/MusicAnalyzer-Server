import { chord_name_margin } from "../chord-view-params/margin";
import { chord_text_size } from "../chord-view-params/text-size";
import { ChordRomanModel } from "./model";
import { ChordRomanView } from "./view";
import { RequiredByChordRomanModel } from "./r-model";
import { IChordRoman } from "./i-part";
import { ChordPartText } from "./chord-part-text";

export class ChordRoman
  extends ChordPartText<ChordRomanModel, ChordRomanView>
  implements IChordRoman {
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
