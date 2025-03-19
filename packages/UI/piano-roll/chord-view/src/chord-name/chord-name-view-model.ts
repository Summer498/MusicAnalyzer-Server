import { _Chord } from "@music-analyzer/tonal-objects";
import { MVVM_ViewModel } from "@music-analyzer/view";
import { ChordNameModel } from "./chord-name-model";
import { ChordNameView } from "./chord-name-view";
import { TimeAndRomanAnalysis } from "@music-analyzer/chord-analyze";
import { NoteSize, PianoRollHeight } from "@music-analyzer/view-parameters";
import { chord_text_size } from "../chord-view-params";

const scaled = (e: number) => e * NoteSize.get();

export class ChordNameVM 
  extends MVVM_ViewModel<ChordNameModel, ChordNameView> {
  #y: number;
  constructor(e: TimeAndRomanAnalysis) {
    const model = new ChordNameModel(e);
    super(model, new ChordNameView(model));
    this.#y = PianoRollHeight.get() + chord_text_size;
    this.updateX();
    this.updateY();
  }
  updateX() { this.view.updateX(scaled(this.model.time.begin)) }
  updateY() { this.view.updateY(this.#y) }
  onWindowResized() {
    this.updateX();
  }
}
