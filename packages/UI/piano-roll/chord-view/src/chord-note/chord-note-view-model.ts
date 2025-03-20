import { AudioReflectable, MVVM_ViewModel } from "@music-analyzer/view";
import { ChordNoteModel } from "./chord-note-model";
import { ChordNoteView } from "./chord-note-view";
import { TimeAndRomanAnalysis } from "@music-analyzer/chord-analyze";
import { BlackKeyPrm, NoteSize, PianoRollBegin } from "@music-analyzer/view-parameters";
import { mod } from "@music-analyzer/math";
import { Chord } from "@music-analyzer/tonal-objects";

const transposed = (e: number) => e - PianoRollBegin.get()
const scaled = (e: number) => e * NoteSize.get();
const convertToCoordinate = (e: number) => e * BlackKeyPrm.height;

export class ChordNote
  extends MVVM_ViewModel<ChordNoteModel, ChordNoteView>
  implements AudioReflectable {
  #y: number;
  constructor(
    e: TimeAndRomanAnalysis,
    chord: Chord,
    note: string,
    oct: number,
  ) {
    const model = new ChordNoteModel(e, chord, note, oct);
    super(model, new ChordNoteView(model));
    this.#y =
      convertToCoordinate(mod(-transposed(this.model.note), 12))
      + convertToCoordinate(12 * this.model.oct);
    this.updateX();
    this.updateY();
    this.updateWidth();
    this.updateHeight();
  }
  updateX() { this.view.updateX(scaled(this.model.time.begin)) }
  updateY() { this.view.updateY(this.#y) }
  updateWidth() { this.view.updateWidth(scaled(this.model.time.duration)) }
  updateHeight() { this.view.updateHeight(BlackKeyPrm.height) }
  onWindowResized() {
    this.updateX();
    this.updateWidth();
    this.updateHeight();
  }
  onAudioUpdate() {
    this.onWindowResized();
  }
}
