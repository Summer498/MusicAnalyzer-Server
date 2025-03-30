import { OctaveCount } from "./facade";
import { MVVM_Collection_Impl } from "./facade";
import { ChordNotesInOctave } from "./chord-notes-in-octave";
import { IChordNotes } from "./facade";
import { RequiredByChordNoteModel } from "./facade";

export class ChordNotes
  extends MVVM_Collection_Impl<ChordNotesInOctave>
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
