import { Chord } from "@music-analyzer/tonal-objects/src/chord/chord";
import { getNote } from "@music-analyzer/tonal-objects/src/note/get";
import { MVVM_Collection } from "@music-analyzer/view/src/mvvm/collection";
import { ChordNote } from "./chord-note";
import { IChordNotesInOctave } from "./i-chord-notes-in-octave";
import { RequiredByChordNoteModel } from "./r-chord-note-model";

export class ChordNotesInOctave
  extends MVVM_Collection<ChordNote>
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
