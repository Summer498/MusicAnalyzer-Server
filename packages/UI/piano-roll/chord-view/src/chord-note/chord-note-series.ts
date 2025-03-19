import { TimeAndRomanAnalysis } from "@music-analyzer/chord-analyze";
import { _Chord, Chord } from "@music-analyzer/tonal-objects";
import { ReflectableTimeAndMVCControllerCollection } from "@music-analyzer/view";
import { OctaveCount } from "@music-analyzer/view-parameters";
import { ChordNoteVM } from "./chord-note-view-model";
import { MVVM_Collection } from "@music-analyzer/view";

export class ChordNotesInOctave 
  extends MVVM_Collection<ChordNoteVM> {
  constructor(roman: TimeAndRomanAnalysis, chord: Chord, oct: number) {
    super(`${chord.name}-${oct}`, chord.notes.map(note => new ChordNoteVM(roman, chord, note, oct)));
  }
}

export class ChordNotes 
  extends MVVM_Collection<ChordNotesInOctave> {
  constructor(readonly model: TimeAndRomanAnalysis) {
    const chord = _Chord.get(model.chord);
    super(chord.name, [...Array(OctaveCount.get())].map((_, oct) => new ChordNotesInOctave(model, chord, oct)));
  }
}

export class ChordNotesSeries 
  extends ReflectableTimeAndMVCControllerCollection<ChordNotes> {
  constructor(romans: TimeAndRomanAnalysis[]) {
    super("chords", romans.map(roman => new ChordNotes(roman)));
  }
}
