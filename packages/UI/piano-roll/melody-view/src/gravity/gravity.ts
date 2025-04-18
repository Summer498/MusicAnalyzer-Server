import { BlackKeyPrm } from "@music-analyzer/view-parameters";
import { NoteSize } from "@music-analyzer/view-parameters";
import { GravityModel } from "./gravity-model";
import { GravityView, LinePos } from "./gravity-view";
import { Part } from "../abstract/abstract-part";

export class Gravity
  extends Part<GravityModel, GravityView>
  {
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
