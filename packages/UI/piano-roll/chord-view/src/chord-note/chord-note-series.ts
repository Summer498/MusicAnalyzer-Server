import { TimeAndRomanAnalysis } from "@music-analyzer/chord-analyze";
import { _Chord, Chord } from "@music-analyzer/tonal-objects";
import { AudioReflectableRegistry, ReflectableTimeAndMVCControllerCollection, WindowReflectableRegistry } from "@music-analyzer/view";
import { OctaveCount } from "@music-analyzer/view-parameters";
import { MVVM_Collection } from "@music-analyzer/view";
import { ChordNote } from "./chord-note";

export class ChordNotesInOctave
  extends MVVM_Collection<ChordNote> {
  constructor(
    roman: TimeAndRomanAnalysis,
    chord: Chord,
    oct: number,
    controllers: [AudioReflectableRegistry, WindowReflectableRegistry],
  ) {
    super(`${chord.name}-${oct}`, chord.notes.map(note => new ChordNote(roman, chord, note, oct, controllers)));
  }
}

export class ChordNotes
  extends MVVM_Collection<ChordNotesInOctave> {
  constructor(
    readonly model: TimeAndRomanAnalysis,
    controllers: [AudioReflectableRegistry, WindowReflectableRegistry]
  ) {
    const chord = _Chord.get(model.chord);
    super(chord.name, [...Array(OctaveCount.get())].map((_, oct) => new ChordNotesInOctave(model, chord, oct, controllers)));
  }
  onWindowResized() { }
}

export class ChordNotesSeries
  extends ReflectableTimeAndMVCControllerCollection<ChordNotes> {
  constructor(
    romans: TimeAndRomanAnalysis[],
    controllers: [AudioReflectableRegistry, WindowReflectableRegistry]
  ) {
    super("chords", romans.map(roman => new ChordNotes(roman, controllers)));
  }
}
