import { TimeAndRomanAnalysis } from "@music-analyzer/chord-analyze/src/chord-analyze/time-and-roman-analysis";
import { Chord } from "@music-analyzer/tonal-objects/src/chord/chord";
import { AudioReflectable } from "@music-analyzer/view/src/reflectable/audio-reflectable";
import { WindowReflectable } from "@music-analyzer/view/src/reflectable/window-reflectable";
import { MVVM_Collection } from "@music-analyzer/view/src/mvvm/collection";
import { ChordNote } from "./chord-note/chord-note";
import { TimeRangeSubscriber } from "@music-analyzer/controllers/src/slider/time-range/time-range-subscriber";

export interface IChordNotesInOctave
  extends
  AudioReflectable,
  TimeRangeSubscriber,
  WindowReflectable { }

export class ChordNotesInOctave
  extends MVVM_Collection<ChordNote>
  implements IChordNotesInOctave {
  constructor(
    roman: TimeAndRomanAnalysis,
    chord: Chord,
    oct: number,
  ) {
    super(`${chord.name}-${oct}`, chord.notes.map(note => new ChordNote(roman, chord, note, oct)));
  }
  onAudioUpdate() { this.children.forEach(e => e.onAudioUpdate()) }
  onTimeRangeChanged() { this.children.forEach(e => e.onTimeRangeChanged()) }
  onWindowResized() { this.children.forEach(e => e.onWindowResized()) }
}
