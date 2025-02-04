import { AccompanyToAudio } from "@music-analyzer/view";
import { DMelodyModel } from "./d-melody-model";
import { DMelodyView } from "./d-melody-view";
import { DMelodySwitcher } from "@music-analyzer/controllers";
import { IMelodyModel } from "@music-analyzer/melody-analyze";
import { CurrentTimeX, NoteSize, NowAtX } from "@music-analyzer/view-parameters";
import { insertMelody } from "./melody-editor-function";

export class DMelodyController implements AccompanyToAudio {
  readonly model: DMelodyModel;
  readonly view: DMelodyView;
  readonly d_melody_switcher: DMelodySwitcher;
  constructor(d_melody: IMelodyModel, d_melody_switcher: DMelodySwitcher) {
    this.model = new DMelodyModel(d_melody);
    this.view = new DMelodyView(this.model);
    this.d_melody_switcher = d_melody_switcher;
    this.onAudioUpdate();
  }

  updateX() { this.view.x = CurrentTimeX.value + this.model.begin * NoteSize.value - NowAtX.value; }
  updateWidth() { this.view.width = this.model.end * NoteSize.value - this.model.begin * NoteSize.value; }
  onAudioUpdate() {
    this.view.onclick = insertMelody;
    this.view.visibility = this.d_melody_switcher.checkbox.checked ? "visible" : "hidden";
  }
}
