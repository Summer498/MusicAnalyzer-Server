import { _Note } from "@music-analyzer/tonal-objects";
import { MVCController } from "@music-analyzer/view";
import { ChordNoteModel } from "./chord-note-model";
import { ChordNoteView } from "./chord-note-view";

export class ChordNoteController extends MVCController {
  readonly model: ChordNoteModel;
  readonly view: ChordNoteView;
  constructor(model: ChordNoteModel) {
    super();
    this.model = model;
    this.view = new ChordNoteView(this.model);
  }
}
