import { MVVM_ViewModel } from "@music-analyzer/view/src/mvvm/mvvm";
import { NoteSize } from "@music-analyzer/view-parameters/src/note-size";
import { PianoRollHeight } from "@music-analyzer/view-parameters/src/piano-roll/piano-roll-height";
import { TimeRangeSubscriber } from "@music-analyzer/controllers/src/slider/time-range/time-range-subscriber";
import { ChordKeyModel } from "./chord-key-model";
import { ChordKeyView } from "./chord-key-view";
import { chord_name_margin } from "./chord-view-params/margin";
import { chord_text_size } from "./chord-view-params/text-size";
import { RequiredByChordKeyModel } from "./r-chord-key-model";

const scaled = (e: number) => e * NoteSize.get();

export class ChordKey
  extends MVVM_ViewModel<ChordKeyModel, ChordKeyView>
  implements TimeRangeSubscriber {
  #y: number;
  constructor(
    e: RequiredByChordKeyModel,
  ) {
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
  onTimeRangeChanged = this.onWindowResized
}
