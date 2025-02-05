import { _Note } from "@music-analyzer/tonal-objects";
import { Controller } from "@music-analyzer/view";
import { ChordNoteModel } from "./chord-note-model";
import { ChordNoteView } from "./chord-note-view";

export class ChordNoteController implements Controller {
  readonly model: ChordNoteModel;
  readonly view: ChordNoteView;
  constructor(model: ChordNoteModel) {
    this.model = model;
    this.view = new ChordNoteView(this.model);
  }
  onAudioUpdate() {
    this.view.onAudioUpdate();
  }
}
