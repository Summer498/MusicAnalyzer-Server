import { OctaveCount } from "@music-analyzer/view-parameters/src/piano-roll/octave-count";
import { MVVM_Collection } from "@music-analyzer/view/src/mvvm/collection";
import { ChordNotesInOctave } from "./chord-notes-in-octave";
import { IChordNotes } from "./i-chord-notes";
import { RequiredByChordNoteModel } from "./r-chord-note-model";

export class ChordNotes
  extends MVVM_Collection<ChordNotesInOctave>
  implements IChordNotes {
  constructor(
    readonly model: RequiredByChordNoteModel,
  ) {
    const chord = model.chord;
    super(chord.name, [...Array(OctaveCount.get())].map((_, oct) => new ChordNotesInOctave(model, chord, oct)));
  }
  onAudioUpdate() { this.children.forEach(e => e.onAudioUpdate()) }
  onTimeRangeChanged() { this.children.forEach(e => e.onTimeRangeChanged()) }
  onWindowResized() { this.children.forEach(e => e.onWindowResized()) }
}
