import { AudioReflectable} from "@music-analyzer/view/src/reflectable/audio-reflectable";
import { AudioReflectableRegistry } from "@music-analyzer/view/src/reflectable/audio-reflectable-registry";
import { MVVM_ViewModel} from "@music-analyzer/view/src/mvc";
import { WindowReflectableRegistry } from "@music-analyzer/view/src/reflectable/window-reflectable-registry";
import { ChordNoteModel } from "./chord-note-model";
import { ChordNoteView } from "./chord-note-view";
import { TimeAndRomanAnalysis } from "@music-analyzer/chord-analyze";
import { BlackKeyPrm } from "@music-analyzer/view-parameters/src/piano-roll/piano-roll-constants";
import { NoteSize } from "@music-analyzer/view-parameters/src/note-size";
import { PianoRollBegin } from "@music-analyzer/view-parameters/src/piano-roll/piano-roll-begin";
import { mod } from "@music-analyzer/math";
import { Chord } from "@music-analyzer/tonal-objects";
import { TimeRangeController } from "@music-analyzer/controllers";
import { TimeRangeSubscriber } from "@music-analyzer/controllers";

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
  implements
  AudioReflectable,
  TimeRangeSubscriber {
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
