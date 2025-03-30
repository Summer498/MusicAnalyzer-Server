import { chord_name_margin } from "./facade/margin";
import { chord_text_size } from "./facade/chord-view-params";
import { ChordRomanModel } from "./facade/model";
import { ChordRomanView } from "./facade/chord-view";
import { RequiredByChordRomanModel } from "./facade/r-model";
import { IChordRoman } from "./facade/i-part";
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
