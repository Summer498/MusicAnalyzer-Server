import { chord_name_margin } from "@music-analyzer/chord-view";
import { chord_text_size } from "@music-analyzer/chord-view";
import { ChordPartText } from "./chord-part-text";
import { IChordRoman } from "../i-part";
import { RequiredByChordRomanModel } from "../r-model";
import { ChordRomanModel } from "../model";
import { ChordRomanView } from "../view";

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
