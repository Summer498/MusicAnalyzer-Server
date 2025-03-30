import { BlackKeyPrm } from "./facade/view-parameters";
import { PianoRollBegin } from "./facade/view-parameters";
import { mod } from "./facade/mod";
import { Note } from"./facade/tonal-object"
import { ChordNoteModel } from "./facade/model";
import { IChordNote } from "./facade/i-part";
import { RequiredByChordNoteModel } from "./facade/r-model";
import { ChordNoteView } from "./facade/chord-view";
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
