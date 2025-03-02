import { _Note } from "@music-analyzer/tonal-objects";
import { MVVM_ViewModel } from "@music-analyzer/view";
import { ChordNoteModel } from "./chord-note-model";
import { ChordNoteView } from "./chord-note-view";

export class ChordNoteVM extends MVVM_ViewModel {
  readonly view: ChordNoteView;
  constructor(
    readonly model: ChordNoteModel,
  ) {
    super();
    this.view = new ChordNoteView(this.model);
  }
}
