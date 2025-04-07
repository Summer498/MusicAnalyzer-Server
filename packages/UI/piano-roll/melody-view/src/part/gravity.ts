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
  constructor(
    model: GravityModel,
    view: GravityView,
    readonly line_seed: LinePos,
  ) {
    super(model, view);
  }
  updateWidth() { this.view.updateWidth(this.converter.scaled(this.model.time.duration)) }
  updateHeight() { this.view.updateHeight(BlackKeyPrm.height) }
  onWindowResized() {
    this.updateWidth();
    this.updateHeight();
    this.view.onWindowResized(this.line_seed.scaled(NoteSize.get(), 1))
  }
  onTimeRangeChanged = this.onWindowResized
}
