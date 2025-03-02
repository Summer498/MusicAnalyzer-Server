import { _Note } from "@music-analyzer/tonal-objects";
import { MVVM_ViewModel } from "@music-analyzer/view";
import { ChordNoteModel } from "./chord-note-model";
import { ChordNoteView } from "./chord-note-view";

export class ChordNoteVM extends MVVM_ViewModel<ChordNoteModel, ChordNoteView> {
  constructor(model: ChordNoteModel) {
    super(model, new ChordNoteView(model));
  }
}
