import { MVVM_Collection_Impl } from "@music-analyzer/view";
import { ChordNotesInOctave } from "./chord-notes-in-octave";
import { RequiredByChordNoteModel } from "../r-model";
import { OctaveCount } from "@music-analyzer/view-parameters";

export class ChordNotes
  extends MVVM_Collection_Impl<ChordNotesInOctave> {
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
