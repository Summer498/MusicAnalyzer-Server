import { BlackKeyPrm } from "./facade";
import { PianoRollBegin } from "./facade";
import { mod } from "./facade";
import { Note } from"./facade"
import { ChordNoteModel } from "./facade";
import { IChordNote } from "./facade";
import { RequiredByChordNoteModel } from "./facade";
import { ChordNoteView } from "./facade";
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
