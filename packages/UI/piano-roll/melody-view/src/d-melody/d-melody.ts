import { BlackKeyPrm } from "@music-analyzer/view-parameters";
import { DMelodyModel } from "./d-melody-model";
import { Part } from "../abstract/abstract-part";
import { DMelodyView } from "./d-melody-view";
import { insertMelody } from "../melody-editor/insert";

export class DMelody
  extends Part<DMelodyModel, DMelodyView>
  {
  constructor(
    model: DMelodyModel,
    view: DMelodyView,
  ) {
    super(model, view);
    this.onAudioUpdate();
    this.updateX();
    this.updateY();
    this.updateWidth();
    this.updateHeight();
  }
  updateX() { this.view.updateX(this.converter.scaled(this.model.time.begin)) }
  updateY() { this.view.updateY(isNaN(this.model.note) ? -99 : -this.converter.convertToCoordinate(this.converter.transposed(this.model.note))) }
  updateWidth() { this.view.updateWidth(this.converter.scaled(this.model.time.duration)) }
  updateHeight() { this.view.updateHeight(BlackKeyPrm.height) }
  onWindowResized() {
    this.updateX();
    this.updateWidth();
    this.updateHeight();
  }
  onAudioUpdate() {
    this.view.onclick = insertMelody;
  }
  onTimeRangeChanged = this.onWindowResized
}
