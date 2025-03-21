import { TimeAndRomanAnalysis } from "@music-analyzer/chord-analyze";
import { _Chord, Chord } from "@music-analyzer/tonal-objects";
import { ReflectableTimeAndMVCControllerCollection } from "@music-analyzer/view";
import { OctaveCount } from "@music-analyzer/view-parameters";
import { MVVM_Collection } from "@music-analyzer/view";
import { ChordNote } from "./chord-note";
import { RequiredByChordNote } from "./chord-note/chord-note";

export interface RequiredByChordNotesInOctave
  extends RequiredByChordNote { }
export class ChordNotesInOctave
  extends MVVM_Collection<ChordNote> {
  constructor(
    roman: TimeAndRomanAnalysis,
    chord: Chord,
    oct: number,
    controllers: RequiredByChordNotesInOctave,
  ) {
    super(`${chord.name}-${oct}`, chord.notes.map(note => new ChordNote(roman, chord, note, oct, controllers)));
  }
}

export interface RequiredByChordNotes
  extends RequiredByChordNotesInOctave { }
export class ChordNotes
  extends MVVM_Collection<ChordNotesInOctave> {
  constructor(
    readonly model: TimeAndRomanAnalysis,
    controllers: RequiredByChordNotes
  ) {
    const chord = _Chord.get(model.chord);
    super(chord.name, [...Array(OctaveCount.get())].map((_, oct) => new ChordNotesInOctave(model, chord, oct, controllers)));
  }
  onWindowResized() { }
}

export interface RequiredByChordNotesSeries
  extends RequiredByChordNotes { }
export class ChordNotesSeries
  extends ReflectableTimeAndMVCControllerCollection<ChordNotes> {
  constructor(
    romans: TimeAndRomanAnalysis[],
    controllers: RequiredByChordNotesSeries
  ) {
    super("chords", romans.map(roman => new ChordNotes(roman, controllers)));
  }
}
