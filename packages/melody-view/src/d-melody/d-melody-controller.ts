import { MVCController } from "@music-analyzer/view";
import { DMelodyModel } from "./d-melody-model";
import { DMelodyView } from "./d-melody-view";
import { insertMelody } from "../melody-editor-function";

export class DMelodyVM extends MVCController {
  readonly view: DMelodyView;
  constructor(
    readonly model: DMelodyModel,
  ) {
    super();
    this.view = new DMelodyView(this.model);
    this.onAudioUpdate();
  }

  onAudioUpdate() {
    this.view.onclick = insertMelody;
  }
}
