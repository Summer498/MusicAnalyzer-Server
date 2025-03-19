import { _Scale } from "@music-analyzer/tonal-objects";
import { MVVM_ViewModel } from "@music-analyzer/view";
import { ChordKeyModel } from "./chord-key-model";
import { ChordKeyView } from "./chord-key-view";
import { TimeAndRomanAnalysis } from "@music-analyzer/chord-analyze";
import { NoteSize, PianoRollHeight } from "@music-analyzer/view-parameters";
import { chord_name_margin, chord_text_size } from "../chord-view-params";

const scaled = (e: number) => e * NoteSize.get();

export class ChordKeyVM 
extends MVVM_ViewModel<ChordKeyModel, ChordKeyView> {
  #y: number;
  constructor(e: TimeAndRomanAnalysis) {
    const model = new ChordKeyModel(e);
    super(model, new ChordKeyView(model));
    this.#y = PianoRollHeight.get() + chord_text_size * 2 + chord_name_margin;
    this.updateX();
    this.updateY();
  }
  updateX() { this.view.updateX(scaled(this.model.time.begin)) }
  updateY() { this.view.updateY(this.#y) }
  onWindowResized() {
    this.updateX();
  }
}
