import { Gravity as GravityAnalysis } from "@music-analyzer/melody-analyze";
import { SerializedTimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { BlackKeyPrm } from "@music-analyzer/view-parameters";
import { NoteSize } from "@music-analyzer/view-parameters";
import { TimeRangeSubscriber } from "@music-analyzer/controllers";
import { GravityModel } from "../model";
import { GravityView } from "../view";
import { LinePos } from "../view";
import { Part } from "./abstract-part";

export class Gravity
  extends Part<GravityModel, GravityView>
  implements TimeRangeSubscriber {
  #line_seed: LinePos;
  constructor(
    e: SerializedTimeAndAnalyzedMelody,
    layer: number,
    readonly next: SerializedTimeAndAnalyzedMelody,
    readonly gravity: GravityAnalysis,
  ) {
    const model = new GravityModel(e, layer, next, gravity);
    super(model, new GravityView());
    this.#line_seed = new LinePos(
      this.model.time.begin + this.model.time.duration / 2,
      this.model.next.time.begin,
      isNaN(this.model.note) ? -99 : (0.5 - this.converter.convertToCoordinate(this.converter.transposed(this.model.note))),
      isNaN(this.model.note) ? -99 : (0.5 - this.converter.convertToCoordinate(this.converter.transposed(this.model.gravity.destination!))),
    )
  }
  updateWidth() { this.view.updateWidth(this.converter.scaled(this.model.time.duration)) }
  updateHeight() { this.view.updateHeight(BlackKeyPrm.height) }
  onWindowResized() {
    this.updateWidth();
    this.updateHeight();
    this.view.onWindowResized(this.#line_seed.scaled(NoteSize.get(), 1))
  }
  onTimeRangeChanged = this.onWindowResized
}
