import { MVVM_ViewModel} from "@music-analyzer/view/src/mvvm/mvvm";
import { NoteSize } from "@music-analyzer/view-parameters/src/note-size";
import { PianoRollHeight } from "@music-analyzer/view-parameters/src/piano-roll/piano-roll-height";
import { TimeRangeSubscriber } from "@music-analyzer/controllers/src/slider/time-range/time-range-subscriber";
import { ChordNameModel } from "./chord-name-model";
import { ChordNameView } from "./chord-name-view";
import { chord_text_size } from "./chord-view-params/text-size";
import { RequiredByChordNameModel } from "./r-chord-name-model";

const scaled = (e: number) => e * NoteSize.get();

export class ChordName
  extends MVVM_ViewModel<ChordNameModel, ChordNameView>
  implements TimeRangeSubscriber {
  #y: number;
  constructor(
    e: RequiredByChordNameModel,
  ) {
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
  onTimeRangeChanged = this.onWindowResized
}
