import { _Chord } from "@music-analyzer/tonal-objects";
import { MVVM_ViewModel, WindowReflectableRegistry } from "@music-analyzer/view";
import { ChordNameModel } from "./chord-name-model";
import { ChordNameView } from "./chord-name-view";
import { TimeAndRomanAnalysis } from "@music-analyzer/chord-analyze";
import { NoteSize, PianoRollHeight } from "@music-analyzer/view-parameters";
import { chord_text_size } from "../../chord-view-params";
import { TimeRangeController, TimeRangeSubscriber } from "@music-analyzer/controllers";

const scaled = (e: number) => e * NoteSize.get();

export interface RequiredByChordName {
  readonly window: WindowReflectableRegistry
  readonly time_range: TimeRangeController,
}
export class ChordName
  extends MVVM_ViewModel<ChordNameModel, ChordNameView>
  implements TimeRangeSubscriber {
  #y: number;
  constructor(
    e: TimeAndRomanAnalysis,
    controllers: RequiredByChordName
  ) {
    const model = new ChordNameModel(e);
    super(model, new ChordNameView(model));
    this.#y = PianoRollHeight.get() + chord_text_size;
    this.updateX();
    this.updateY();
    controllers.window.register(this);
    controllers.time_range.register(this);
  }
  updateX() { this.view.updateX(scaled(this.model.time.begin)) }
  updateY() { this.view.updateY(this.#y) }
  onWindowResized() {
    this.updateX();
  }
  onTimeRangeChanged = this.onWindowResized
}
