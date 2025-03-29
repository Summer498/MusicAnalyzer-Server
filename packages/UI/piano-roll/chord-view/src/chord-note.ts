import { MVVM_ViewModel } from "@music-analyzer/view/src/mvvm/mvvm";
import { BlackKeyPrm } from "@music-analyzer/view-parameters/src/piano-roll/rect-parameters/black-key";
import { NoteSize } from "@music-analyzer/view-parameters/src/note-size";
import { PianoRollBegin } from "@music-analyzer/view-parameters/src/piano-roll/piano-roll-begin";
import { mod } from "@music-analyzer/math/src/basic-function/mod";
import { Note } from "@music-analyzer/tonal-objects/src/note/note";
import { ChordNoteModel } from "./chord-note-model";
import { ChordNoteView } from "./chord-note-view";
import { IChordNote } from "./i-chord-note";
import { RequiredByChordNoteModel } from "./r-chord-note-model";

const transposed = (e: number) => e - PianoRollBegin.get()
const scaled = (e: number) => e * NoteSize.get();
const convertToCoordinate = (e: number) => e * BlackKeyPrm.height;

export class ChordNote
  extends MVVM_ViewModel<ChordNoteModel, ChordNoteView>
  implements IChordNote {
  #y: number;
  constructor(
    e: RequiredByChordNoteModel,
    note: Note,
    oct: number,
  ) {
    const model = new ChordNoteModel(e, note, oct);
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
  onAudioUpdate = this.onWindowResized;
  onTimeRangeChanged = this.onWindowResized
}
