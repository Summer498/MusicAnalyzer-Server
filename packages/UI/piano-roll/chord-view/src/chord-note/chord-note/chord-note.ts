import { AudioReflectable } from "@music-analyzer/view/src/reflectable/audio-reflectable";
import { MVVM_ViewModel } from "@music-analyzer/view/src/mvvm/mvvm";
import { ChordNoteModel } from "./chord-note-model";
import { ChordNoteView } from "./chord-note-view";
import { TimeAndRomanAnalysis } from "@music-analyzer/chord-analyze/src/chord-analyze/time-and-roman-analysis";
import { BlackKeyPrm } from "@music-analyzer/view-parameters/src/piano-roll/rect-parameters/black-key";
import { NoteSize } from "@music-analyzer/view-parameters/src/note-size";
import { PianoRollBegin } from "@music-analyzer/view-parameters/src/piano-roll/piano-roll-begin";
import { mod } from "@music-analyzer/math/src/basic-function/mod";
import { Chord } from "@music-analyzer/tonal-objects/src/chord/chord";
import { TimeRangeSubscriber } from "@music-analyzer/controllers/src/slider/time-range/time-range-subscriber";

const transposed = (e: number) => e - PianoRollBegin.get()
const scaled = (e: number) => e * NoteSize.get();
const convertToCoordinate = (e: number) => e * BlackKeyPrm.height;

export interface IChordNote
  extends
  AudioReflectable,
  TimeRangeSubscriber { }

export class ChordNote
  extends MVVM_ViewModel<ChordNoteModel, ChordNoteView>
  implements IChordNote {
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
  onAudioUpdate = this.onWindowResized;
  onTimeRangeChanged = this.onWindowResized
}
