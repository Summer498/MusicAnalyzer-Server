import { AccompanyToAudio } from "@music-analyzer/view";
import { DMelodyModel } from "./d-melody-model";
import { DMelodyView } from "./d-melody-view";
import { DMelodySwitcher } from "@music-analyzer/controllers";
import { insertMelody } from "../melody-editor-function";

export class DMelodyController implements AccompanyToAudio {
  readonly model: DMelodyModel;
  readonly view: DMelodyView;
  readonly d_melody_switcher: DMelodySwitcher;
  constructor(model: DMelodyModel, d_melody_switcher: DMelodySwitcher) {
    this.model = model;
    this.view = new DMelodyView(this.model);
    this.d_melody_switcher = d_melody_switcher;
    this.onAudioUpdate();
  }

  onAudioUpdate() {
    this.view.onclick = insertMelody;
    this.view.visibility = this.d_melody_switcher.checkbox.checked ? "visible" : "hidden";
  }
}
