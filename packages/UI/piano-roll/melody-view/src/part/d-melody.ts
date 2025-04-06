import { SerializedTimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { BlackKeyPrm } from "@music-analyzer/view-parameters";
import { TimeRangeSubscriber } from "@music-analyzer/controllers";
import { DMelodyModel } from "../model";
import { DMelodyView } from "../view";
import { insertMelody } from "../view/insert";
import { Part } from "./abstract-part";

export class DMelody
  extends Part<DMelodyModel, DMelodyView>
  implements TimeRangeSubscriber {
  constructor(
    e: SerializedTimeAndAnalyzedMelody,
  ) {
    const model = new DMelodyModel(e);
    super(model, new DMelodyView());
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
