import { BlackKeyPrm } from "@music-analyzer/view-parameters/src/piano-roll/rect-parameters/black-key";
import { PianoRollBegin } from "@music-analyzer/view-parameters/src/piano-roll/piano-roll-begin";
import { mod } from "@music-analyzer/math/src/basic-function/mod";
import { Note } from"../facade/tonal-object"
import { ChordNoteModel } from "./model";
import { IChordNote } from "./i-part";
import { RequiredByChordNoteModel } from "./r-model";
import { ChordNoteView } from "./view";
import { ChordPart } from "./chord-part";

const transposed = (e: number) => e - PianoRollBegin.get()
const convertToCoordinate = (e: number) => e * BlackKeyPrm.height;

export class ChordNote
  extends ChordPart<ChordNoteModel, ChordNoteView>
  implements IChordNote {
  y: number;
  constructor(
    e: RequiredByChordNoteModel,
    note: Note,
    oct: number,
  ) {
    const model = new ChordNoteModel(e, note, oct);
    super(model, new ChordNoteView(model));
    this.y =
      convertToCoordinate(mod(-transposed(this.model.note), 12))
      + convertToCoordinate(12 * this.model.oct);
    this.updateX();
    this.updateY();
    this.updateWidth();
    this.updateHeight();
  }
  updateWidth() { this.view.updateWidth(this.scaled(this.model.time.duration)) }
  updateHeight() { this.view.updateHeight(BlackKeyPrm.height) }
  onWindowResized() {
    this.updateX();
    this.updateWidth();
    this.updateHeight();
  }
  onAudioUpdate = this.onWindowResized;
}
