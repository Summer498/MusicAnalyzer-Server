import { OctaveCount } from "@music-analyzer/view-parameters/src/piano-roll/octave-count";
import { MVVM_Collection_Impl } from "../facade/view";
import { ChordNotesInOctave } from "./chord-notes-in-octave";
import { IChordNotes } from "./i-part";
import { RequiredByChordNoteModel } from "./r-model";

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
