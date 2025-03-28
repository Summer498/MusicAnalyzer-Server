import { MVVM_ViewModel } from "@music-analyzer/view/src/mvvm/mvvm";
import { WindowReflectableRegistry } from "@music-analyzer/view/src/reflectable/window-reflectable-registry";
import { GravityModel } from "./gravity-model";
import { GravityView } from "./gravity-view/gravity-view";
import { Gravity as GravityAnalysis } from "@music-analyzer/melody-analyze/src/gravity";
import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze/src/time-and-analyzed-melody";
import { BlackKeyPrm } from "@music-analyzer/view-parameters/src/piano-roll/piano-roll-constants";
import { NoteSize } from "@music-analyzer/view-parameters/src/note-size";
import { PianoRollBegin } from "@music-analyzer/view-parameters/src/piano-roll/piano-roll-begin";
import { LinePos } from "../line-pos";
import { TimeRangeController } from "@music-analyzer/controllers/src/slider/time-range/time-range-controller";
import { TimeRangeSubscriber } from "@music-analyzer/controllers/src/slider/time-range/time-range-subscriber";

const transposed = (e: number) => e - PianoRollBegin.get()
const scaled = (e: number) => e * NoteSize.get();
const convertToCoordinate = (e: number) => e * BlackKeyPrm.height;

export interface RequiredByGravity {
  readonly window: WindowReflectableRegistry
  readonly time_range: TimeRangeController
}
export class Gravity
  extends MVVM_ViewModel<GravityModel, GravityView>
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
