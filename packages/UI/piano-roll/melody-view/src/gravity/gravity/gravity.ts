import { MVVM_ViewModel_Impl } from "@music-analyzer/view";
import { Gravity as GravityAnalysis } from "@music-analyzer/melody-analyze";
import { SerializedTimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { BlackKeyPrm } from "@music-analyzer/view-parameters";
import { NoteSize } from "@music-analyzer/view-parameters";
import { PianoRollBegin } from "@music-analyzer/view-parameters";
import { TimeRangeSubscriber } from "@music-analyzer/controllers";
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
    e: SerializedTimeAndAnalyzedMelody,
    layer: number,
    readonly next: SerializedTimeAndAnalyzedMelody,
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
