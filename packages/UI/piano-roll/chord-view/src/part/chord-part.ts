import { MVVM_ViewModel_Impl } from "../facade/view";
import { NoteSize } from "@music-analyzer/view-parameters/src/note-size";
import { TimeRangeSubscriber } from "@music-analyzer/controllers/src/slider/time-range/time-range-subscriber";
import { ChordPartModel } from "./model";
import { RequiredViewByChordPart } from "./rv-chord-part";

export abstract class ChordPart<
  M extends ChordPartModel,
  V extends RequiredViewByChordPart,
> extends MVVM_ViewModel_Impl<M, V>
  implements TimeRangeSubscriber {
  protected abstract y: number;
  constructor(
    model: M,
    view: V,
  ) {
    super(model, view);
    this.updateX();
    this.updateY();
  }
  protected scaled = (e: number) => e * NoteSize.get();

  updateX() { this.view.updateX(this.scaled(this.model.time.begin)) }
  updateY() { this.view.updateY(this.y) }
  abstract onWindowResized(): void;
  onTimeRangeChanged = this.onWindowResized
}
