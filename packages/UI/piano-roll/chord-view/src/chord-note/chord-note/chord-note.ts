import { AudioReflectable, AudioReflectableRegistry, MVVM_ViewModel, WindowReflectableRegistry } from "@music-analyzer/view";
import { ChordNoteModel } from "./chord-note-model";
import { ChordNoteView } from "./chord-note-view";
import { TimeAndRomanAnalysis } from "@music-analyzer/chord-analyze";
import { BlackKeyPrm, NoteSize, PianoRollBegin } from "@music-analyzer/view-parameters";
import { mod } from "@music-analyzer/math";
import { Chord } from "@music-analyzer/tonal-objects";
import { TimeRangeController, TimeRangeSubscriber } from "@music-analyzer/controllers";

const transposed = (e: number) => e - PianoRollBegin.get()
const scaled = (e: number) => e * NoteSize.get();
const convertToCoordinate = (e: number) => e * BlackKeyPrm.height;

export interface RequiredByChordNote {
  readonly audio: AudioReflectableRegistry,
  readonly window: WindowReflectableRegistry,
  readonly time_range: TimeRangeController,
}
export class ChordNote
  extends MVVM_ViewModel<ChordNoteModel, ChordNoteView>
  implements AudioReflectable, TimeRangeSubscriber {
  #y: number;
  constructor(
    e: TimeAndRomanAnalysis,
    chord: Chord,
    note: string,
    oct: number,
    controllers: RequiredByChordNote
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
    controllers.audio.register(this);
    controllers.window.register(this);
    controllers.time_range.register(this);
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
