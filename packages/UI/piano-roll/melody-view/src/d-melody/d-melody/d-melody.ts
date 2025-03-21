import { MVVM_ViewModel, WindowReflectableRegistry } from "@music-analyzer/view";
import { DMelodyModel } from "./d-melody-model";
import { DMelodyView } from "./d-melody-view";
import { insertMelody } from "../../melody-editor-function";
import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { BlackKeyPrm, NoteSize, PianoRollBegin } from "@music-analyzer/view-parameters";
import { TimeRangeController, TimeRangeSubscriber } from "@music-analyzer/controllers";

const transposed = (e: number) => e - PianoRollBegin.get()
const scaled = (e: number) => e * NoteSize.get()
const convertToCoordinate = (e: number) => e * BlackKeyPrm.height;

export interface RequiredByDMelody {
  readonly window: WindowReflectableRegistry
  readonly time_range: TimeRangeController
}

export class DMelody
  extends MVVM_ViewModel<DMelodyModel, DMelodyView>
  implements TimeRangeSubscriber {
  constructor(
    e: TimeAndAnalyzedMelody,
    controllers: RequiredByDMelody,
  ) {
    const model = new DMelodyModel(e);
    super(model, new DMelodyView(model));
    this.onAudioUpdate();
    this.updateX();
    this.updateY();
    this.updateWidth();
    this.updateHeight();
    controllers.window.register(this)
    controllers.time_range.register(this);
  }
  updateX() { this.view.updateX(scaled(this.model.time.begin)) }
  updateY() { this.view.updateY(isNaN(this.model.note) ? -99 : -convertToCoordinate(transposed(this.model.note))) }
  updateWidth() { this.view.updateWidth(scaled(this.model.time.duration)) }
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
