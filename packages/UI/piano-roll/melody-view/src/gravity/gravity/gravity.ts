import { MVVM_ViewModel_Impl } from "./facade";
import { Gravity as GravityAnalysis } from "./facade";
import { TimeAndAnalyzedMelody } from "./facade";
import { BlackKeyPrm } from "./facade";
import { NoteSize } from "./facade";
import { PianoRollBegin } from "./facade";
import { TimeRangeSubscriber } from "./facade";
import { GravityModel } from "./gravity-model";
import { GravityView } from "./gravity-view";
import { LinePos } from "../line-pos";

const transposed = (e: number) => e - PianoRollBegin.get()
const scaled = (e: number) => e * NoteSize.get();
const convertToCoordinate = (e: number) => e * BlackKeyPrm.height;

export class Gravity
  extends MVVM_ViewModel_Impl<GravityModel, GravityView>
  implements TimeRangeSubscriber {
  #line_seed: LinePos;
  constructor(
    e: TimeAndAnalyzedMelody,
    layer: number,
    readonly next: TimeAndAnalyzedMelody,
    readonly gravity: GravityAnalysis,
  ) {
    const model = new GravityModel(e, layer, next, gravity);
    super(model, new GravityView(model));
    this.#line_seed = new LinePos(
      this.model.time.begin + this.model.time.duration / 2,
      this.model.next.time.begin,
      isNaN(this.model.note) ? -99 : (0.5 - convertToCoordinate(transposed(this.model.note))),
      isNaN(this.model.note) ? -99 : (0.5 - convertToCoordinate(transposed(this.model.gravity.destination!))),
    )
  }
  updateWidth() { this.view.updateWidth(scaled(this.model.time.duration)) }
  updateHeight() { this.view.updateHeight(BlackKeyPrm.height) }
  onWindowResized() {
    this.updateWidth();
    this.updateHeight();
    this.view.onWindowResized(this.#line_seed.scaled(NoteSize.get(), 1))
  }
  onTimeRangeChanged = this.onWindowResized
}
