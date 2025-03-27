import { TimeAndRomanAnalysis } from "@music-analyzer/chord-analyze/src/chord-analyze/time-and-roman-analysis";
import { getChord } from "@music-analyzer/tonal-objects/src/chord/get";
import { Chord } from "@music-analyzer/tonal-objects/src/chord/chord";
import { AudioReflectable} from "@music-analyzer/view/src/reflectable/audio-reflectable";
import { ReflectableTimeAndMVCControllerCollection } from "@music-analyzer/view/src/svg-collection";
import { WindowReflectable } from "@music-analyzer/view/src/reflectable/window-reflectable";
import { OctaveCount } from "@music-analyzer/view-parameters/src/piano-roll/octave-count";
import { MVVM_Collection } from "@music-analyzer/view/src/mvc";
import { ChordNote } from "./chord-note";
import { RequiredByChordNote } from "./chord-note";
import { TimeRangeSubscriber } from "@music-analyzer/controllers/src/slider/time-range/time-range-subscriber";

export interface RequiredByChordNotesInOctave
  extends RequiredByChordNote { }
export class ChordNotesInOctave
  extends MVVM_Collection<ChordNote>
  implements
  AudioReflectable,
  TimeRangeSubscriber,
  WindowReflectable {
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

export interface RequiredByChordNotes
  extends RequiredByChordNotesInOctave { }
export class ChordNotes
  extends MVVM_Collection<ChordNotesInOctave>
  implements
  AudioReflectable,
  TimeRangeSubscriber,
  WindowReflectable {
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

export interface RequiredByChordNotesSeries
  extends RequiredByChordNotes { }
export class ChordNotesSeries
  extends ReflectableTimeAndMVCControllerCollection<ChordNotes>
  implements
  AudioReflectable,
  TimeRangeSubscriber,
  WindowReflectable {
  constructor(
    romans: TimeAndRomanAnalysis[],
    controllers: RequiredByChordNotesSeries
  ) {
    super("chords", romans.map(roman => new ChordNotes(roman)));
    controllers.audio.register(this);
    controllers.window.register(this);
    controllers.time_range.register(this);
  }
  onAudioUpdate() { this.children.forEach(e => e.onAudioUpdate()) }
  onTimeRangeChanged() { this.children.forEach(e => e.onTimeRangeChanged()) }
  onWindowResized() { this.children.forEach(e => e.onWindowResized()) }
}
