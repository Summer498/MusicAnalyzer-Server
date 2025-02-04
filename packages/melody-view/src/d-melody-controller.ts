import { AccompanyToAudio } from "@music-analyzer/view";
import { DMelodyModel } from "./d-melody-model";
import { DMelodyView } from "./d-melody-view";
import { DMelodySwitcher } from "@music-analyzer/controllers";
import { IMelodyModel } from "@music-analyzer/melody-analyze";
import { black_key_prm, CurrentTimeX, NoteSize, NowAt, NowAtX, PianoRollBegin } from "@music-analyzer/view-parameters";
import { insertMelody } from "./melody-editor-function";

export class DMelodyController implements AccompanyToAudio {
  readonly model: DMelodyModel;
  readonly view: DMelodyView;
  readonly d_melody_switcher: DMelodySwitcher;
  constructor(d_melody: IMelodyModel, d_melody_switcher: DMelodySwitcher) {
    this.model = new DMelodyModel(d_melody);
    this.view = new DMelodyView();
    this.d_melody_switcher = d_melody_switcher;
    this.initializeView();
    this.registerListeners();

    this.onAudioUpdate();
  }
  initializeView() {
    this.view.y = this.model.note === undefined ? -99 : (PianoRollBegin.value - this.model.note) * black_key_prm.height;
    this.view.width = this.model.end * NoteSize.value - this.model.begin * NoteSize.value;
    this.view.height = black_key_prm.height;
  }
  registerListeners() {
    /*
    CurrentTimeX.onUpdate.push(this.updateX.bind(this));
    NowAt.onUpdate.push(this.updateX.bind(this));
    NoteSize.onUpdate.push(this.updateX.bind(this));
    NoteSize.onUpdate.push(this.updateWidth.bind(this));
    */
  }

  updateX() { this.view.x = CurrentTimeX.value + this.model.begin * NoteSize.value - NowAtX.value; }
  updateWidth() { this.view.width = this.model.end * NoteSize.value - this.model.begin * NoteSize.value; }
  onAudioUpdate() {
    this.view.onclick = insertMelody;
    this.view.visibility = this.d_melody_switcher.checkbox.checked ? "visible" : "hidden";
  }
}

