import { AccompanyToAudio } from "@music-analyzer/view";
import { DMelodyModel } from "./d-melody-model";
import { DMelodyView } from "./d-melody-view";
import { insertMelody } from "../melody-editor-function";

export class DMelodyController implements AccompanyToAudio {
  readonly model: DMelodyModel;
  readonly view: DMelodyView;
  constructor(model: DMelodyModel) {
    this.model = model;
    this.view = new DMelodyView(this.model);
    this.onAudioUpdate();
  }

  onAudioUpdate() {
    this.view.onclick = insertMelody;
  }
}
