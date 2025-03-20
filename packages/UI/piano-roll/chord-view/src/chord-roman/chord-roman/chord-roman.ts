import { _Chord } from "@music-analyzer/tonal-objects";
import { MVVM_ViewModel, WindowReflectableRegistry } from "@music-analyzer/view";
import { ChordRomanModel } from "./chord-roman-model";
import { ChordRomanView } from "./chord-roman-view";
import { TimeAndRomanAnalysis } from "@music-analyzer/chord-analyze";
import { NoteSize, PianoRollHeight } from "@music-analyzer/view-parameters";
import { chord_name_margin, chord_text_size } from "../../chord-view-params";
import { TimeRangeSubscriber } from "@music-analyzer/controllers";

const scaled = (e: number) => e * NoteSize.get();

export class ChordRoman 
  extends MVVM_ViewModel<ChordRomanModel, ChordRomanView>
  implements TimeRangeSubscriber
  {
  #y: number;
  constructor(
    e: TimeAndRomanAnalysis,
    publisher: [WindowReflectableRegistry]
  ) {
    const model = new ChordRomanModel(e);
    super(model, new ChordRomanView(model));
    this.#y = PianoRollHeight.get() + chord_text_size * 2 + chord_name_margin;
    this.updateX();
    this.updateY();
    publisher.forEach(e=>e.register(this));
  }
  updateX() { this.view.updateX(scaled(this.model.time.begin)) }
  updateY() { this.view.updateY(this.#y) }
  onWindowResized() {
    this.updateX();
  }
  onTimeRangeChanged = this.onWindowResized
}
