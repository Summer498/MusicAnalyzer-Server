import { IChordNotesSeries } from "./i-chord-note-series";
import { RequiredByChordNotesSeries } from "./r-chord-note-series";
import { ChordNotes } from "./chord-notes";
import { ChordPartSeries } from "./chord-parts-series";
import { RequiredByChordNoteModel } from "./r-chord-note-model";

export class ChordNotesSeries
  extends ChordPartSeries<ChordNotes>
  implements IChordNotesSeries {
  constructor(
    romans: RequiredByChordNoteModel[],
    controllers: RequiredByChordNotesSeries
  ) {
    super("chords", controllers, romans.map(roman => new ChordNotes(roman)));
  }
}
