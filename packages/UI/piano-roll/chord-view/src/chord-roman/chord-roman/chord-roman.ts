import { MVVM_ViewModel} from "@music-analyzer/view/src/mvc";
import { WindowReflectableRegistry } from "@music-analyzer/view/src/reflectable/window-reflectable-registry";
import { ChordRomanModel } from "./chord-roman-model";
import { ChordRomanView } from "./chord-roman-view";
import { TimeAndRomanAnalysis } from "@music-analyzer/chord-analyze/src/chord-analyze/time-and-roman-analysis";
import { NoteSize } from "@music-analyzer/view-parameters/src/note-size";
import { PianoRollHeight } from "@music-analyzer/view-parameters/src/piano-roll/piano-roll-height";
import { chord_name_margin } from "../../chord-view-params";
import { chord_text_size } from "../../chord-view-params";
import { TimeRangeController } from "@music-analyzer/controllers";
import { TimeRangeSubscriber } from "@music-analyzer/controllers";

const scaled = (e: number) => e * NoteSize.get();

export interface RequiredByChordRoman {
  readonly window: WindowReflectableRegistry
  readonly time_range: TimeRangeController,
}
export class ChordRoman
  extends MVVM_ViewModel<ChordRomanModel, ChordRomanView>
  implements TimeRangeSubscriber {
  #y: number;
  constructor(
    e: TimeAndRomanAnalysis,
  ) {
    const model = new ChordRomanModel(e);
    super(model, new ChordRomanView(model));
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
