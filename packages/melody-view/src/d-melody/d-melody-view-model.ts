import { MVVM_ViewModel } from "@music-analyzer/view";
import { DMelodyModel } from "./d-melody-model";
import { DMelodyView } from "./d-melody-view";
import { insertMelody } from "../melody-editor-function";
import { TimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";

export class DMelodyVM extends MVVM_ViewModel<DMelodyModel, DMelodyView> {
  constructor(e: TimeAndAnalyzedMelody) {
    const model = new DMelodyModel(e);
    super(model, new DMelodyView(model));
    this.onAudioUpdate();
  }
  onAudioUpdate() {
    this.view.onclick = insertMelody;
  }
}
