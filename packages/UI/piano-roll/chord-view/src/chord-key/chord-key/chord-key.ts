import { _Scale } from "@music-analyzer/tonal-objects";
import { MVVM_ViewModel} from "@music-analyzer/view/src/mvc";
import { WindowReflectableRegistry } from "@music-analyzer/view/src/reflectable/window-reflectable-registry";
import { ChordKeyModel } from "./chord-key-model";
import { ChordKeyView } from "./chord-key-view";
import { TimeAndRomanAnalysis } from "@music-analyzer/chord-analyze";
import { NoteSize } from "@music-analyzer/view-parameters";
import { PianoRollHeight } from "@music-analyzer/view-parameters";
import { chord_name_margin } from "../../chord-view-params";
import { chord_text_size } from "../../chord-view-params";
import { TimeRangeController } from "@music-analyzer/controllers";
import { TimeRangeSubscriber } from "@music-analyzer/controllers";

const scaled = (e: number) => e * NoteSize.get();

export interface RequiredByChordKey {
  readonly window: WindowReflectableRegistry
  readonly time_range: TimeRangeController,
}
export class ChordKey
  extends MVVM_ViewModel<ChordKeyModel, ChordKeyView>
  implements TimeRangeSubscriber {
  #y: number;
  constructor(
    e: TimeAndRomanAnalysis,
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
