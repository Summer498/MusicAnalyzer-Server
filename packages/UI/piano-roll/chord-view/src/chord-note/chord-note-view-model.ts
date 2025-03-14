import { _Note, Chord } from "@music-analyzer/tonal-objects";
import { AudioReflectable, MVVM_ViewModel } from "@music-analyzer/view";
import { ChordNoteModel } from "./chord-note-model";
import { ChordNoteView } from "./chord-note-view";
import { TimeAndRomanAnalysis } from "@music-analyzer/chord-analyze";

export class ChordNoteVM
  extends MVVM_ViewModel<ChordNoteModel, ChordNoteView>
  implements AudioReflectable {
  constructor(
    e: TimeAndRomanAnalysis,
    chord: Chord,
    note: string,
    oct: number,
  ) {
    const model = new ChordNoteModel(e, chord, note, oct);
    super(model, new ChordNoteView(model));
  }
  onAudioUpdate() {
    this.view.onWindowResized();
  }
  onWindowResized() {
    this.view.onWindowResized()
  }
}
