import { TimeAndRomanAnalysis } from "@music-analyzer/chord-to-roman";
import { _Note, Chord } from "@music-analyzer/tonal-objects";
import { Controller } from "@music-analyzer/view";
import { ChordNoteModel } from "./chord-note-model";
import { ChordNoteView } from "./chord-note-view";

export class ChordNoteController implements Controller {
  readonly model: ChordNoteModel;
  readonly view: ChordNoteView;
  constructor(
    e: TimeAndRomanAnalysis,
    chord: Chord,
    note: string,
    oct: number
  ) {
    this.model = new ChordNoteModel(e, chord, note, oct);
    this.view = new ChordNoteView(this.model);
  }
  onAudioUpdate() {
    this.view.onAudioUpdate();
  }
}

