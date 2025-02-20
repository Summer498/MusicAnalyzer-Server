import { DMelodyModel } from "./d-melody-model";
import { DMelodyView } from "./d-melody-view";
import { insertMelody } from "../melody-editor-function";
import { MVCController } from "@music-analyzer/view";

export class DMelodyController extends MVCController {
  readonly model: DMelodyModel;
  readonly view: DMelodyView;
  constructor(model: DMelodyModel) {
    super();
    this.model = model;
    this.view = new DMelodyView(this.model);
    this.onAudioUpdate();
  }

  onAudioUpdate() {
    this.view.onclick = insertMelody;
  }
}
