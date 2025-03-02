import { MVVM_ViewModel } from "@music-analyzer/view";
import { DMelodyModel } from "./d-melody-model";
import { DMelodyView } from "./d-melody-view";
import { insertMelody } from "../melody-editor-function";

export class DMelodyVM extends MVVM_ViewModel<DMelodyModel, DMelodyView> {
  constructor(model: DMelodyModel) {
    super(model, new DMelodyView(model));
    this.onAudioUpdate();
  }
  onAudioUpdate() {
    this.view.onclick = insertMelody;
  }
}
