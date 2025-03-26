import { TimeAndRomanAnalysis } from "@music-analyzer/chord-analyze";
import { _Chord } from "@music-analyzer/tonal-objects";
import { Chord } from "@music-analyzer/tonal-objects";
import { AudioReflectable } from "@music-analyzer/view";
import { ReflectableTimeAndMVCControllerCollection } from "@music-analyzer/view";
import { WindowReflectable } from "@music-analyzer/view";
import { OctaveCount } from "@music-analyzer/view-parameters";
import { MVVM_Collection } from "@music-analyzer/view";
import { ChordNote } from "./chord-note";
import { RequiredByChordNote } from "./chord-note";
import { TimeRangeSubscriber } from "@music-analyzer/controllers";

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
    const chord = _Chord.get(model.chord);
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
