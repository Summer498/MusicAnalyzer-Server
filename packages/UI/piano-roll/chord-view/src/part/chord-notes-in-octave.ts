import { Chord } from"../facade/tonal-object"
import { getNote } from"../facade/tonal-object"
import { MVVM_Collection_Impl } from "../facade/view";
import { ChordNote } from "./chord-note";
import { IChordNotesInOctave } from "./i-part";
import { RequiredByChordNoteModel } from "./r-model";

export class ChordNotesInOctave
  extends MVVM_Collection_Impl<ChordNote>
  implements IChordNotesInOctave {
  constructor(
    roman: RequiredByChordNoteModel,
    chord: Chord,
    oct: number,
  ) {
    super(`${chord.name}-${oct}`, chord.notes.map(note => new ChordNote(roman, getNote(note), oct)));
  }
  onAudioUpdate() { this.children.forEach(e => e.onAudioUpdate()) }
  onTimeRangeChanged() { this.children.forEach(e => e.onTimeRangeChanged()) }
  onWindowResized() { this.children.forEach(e => e.onWindowResized()) }
}
