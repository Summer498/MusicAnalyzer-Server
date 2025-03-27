import { MVVM_ViewModel} from "@music-analyzer/view/src/mvc";
import { WindowReflectableRegistry } from "@music-analyzer/view/src/reflectable/window-reflectable-registry";
import { DMelodyModel } from "./d-melody-model";
import { DMelodyView } from "./d-melody-view";
import { insertMelody } from "../../melody-editor-function";
import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { BlackKeyPrm } from "@music-analyzer/view-parameters/src/piano-roll/piano-roll-constants";
import { NoteSize } from "@music-analyzer/view-parameters/src/note-size";
import { PianoRollBegin } from "@music-analyzer/view-parameters/src/piano-roll/piano-roll-begin";
import { TimeRangeController } from "@music-analyzer/controllers";
import { TimeRangeSubscriber } from "@music-analyzer/controllers";

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
  ) {
    const model = new DMelodyModel(e);
    super(model, new DMelodyView(model));
    this.onAudioUpdate();
    this.updateX();
    this.updateY();
    this.updateWidth();
    this.updateHeight();
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
