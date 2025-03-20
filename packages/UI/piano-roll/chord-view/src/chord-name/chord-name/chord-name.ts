import { _Chord } from "@music-analyzer/tonal-objects";
import { AudioReflectableRegistry, MVVM_ViewModel, WindowReflectableRegistry } from "@music-analyzer/view";
import { ChordNameModel } from "./chord-name-model";
import { ChordNameView } from "./chord-name-view";
import { TimeAndRomanAnalysis } from "@music-analyzer/chord-analyze";
import { NoteSize, PianoRollHeight } from "@music-analyzer/view-parameters";
import { chord_text_size } from "../../chord-view-params";

const scaled = (e: number) => e * NoteSize.get();

export class ChordName 
  extends MVVM_ViewModel<ChordNameModel, ChordNameView> {
  #y: number;
  constructor(
    e: TimeAndRomanAnalysis,
    publisher: [WindowReflectableRegistry]
  ) {
    const model = new ChordNameModel(e);
    super(model, new ChordNameView(model));
    this.#y = PianoRollHeight.get() + chord_text_size;
    this.updateX();
    this.updateY();
    publisher.forEach(e=>e.register(this));
  }
  updateX() { this.view.updateX(scaled(this.model.time.begin)) }
  updateY() { this.view.updateY(this.#y) }
  onWindowResized() {
    this.updateX();
  }
}
