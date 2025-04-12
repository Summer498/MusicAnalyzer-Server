import { NoteSize } from "@music-analyzer/view-parameters";
import { MVVM_ViewModel_Impl } from "@music-analyzer/view";
import { RequiredViewByChordPart } from "./rv-chord-part";
import { ChordPartModel } from "../model";

export abstract class ChordPart<
  M extends ChordPartModel,
  V extends RequiredViewByChordPart,
> extends MVVM_ViewModel_Impl<M, V> {
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
