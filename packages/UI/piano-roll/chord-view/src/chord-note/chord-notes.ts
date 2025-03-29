import { TimeAndRomanAnalysis } from "@music-analyzer/chord-analyze/src/chord-analyze/time-and-roman-analysis";
import { getChord } from "@music-analyzer/tonal-objects/src/chord/get";
import { AudioReflectable } from "@music-analyzer/view/src/reflectable/audio-reflectable";
import { WindowReflectable } from "@music-analyzer/view/src/reflectable/window-reflectable";
import { OctaveCount } from "@music-analyzer/view-parameters/src/piano-roll/octave-count";
import { MVVM_Collection } from "@music-analyzer/view/src/mvvm/collection";
import { TimeRangeSubscriber } from "@music-analyzer/controllers/src/slider/time-range/time-range-subscriber";
import { ChordNotesInOctave } from "./chord-notes-in-octave";

export interface IChordNotes
  extends
  AudioReflectable,
  TimeRangeSubscriber,
  WindowReflectable { }

export class ChordNotes
  extends MVVM_Collection<ChordNotesInOctave>
  implements IChordNotes {
  constructor(
    readonly model: TimeAndRomanAnalysis,
  ) {
    const chord = getChord(model.chord);
    super(chord.name, [...Array(OctaveCount.get())].map((_, oct) => new ChordNotesInOctave(model, chord, oct)));
  }
  onAudioUpdate() { this.children.forEach(e => e.onAudioUpdate()) }
  onTimeRangeChanged() { this.children.forEach(e => e.onTimeRangeChanged()) }
  onWindowResized() { this.children.forEach(e => e.onWindowResized()) }
}
