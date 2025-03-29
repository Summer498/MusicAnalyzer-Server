import { ChordNotes } from "./part";
import { ChordPartSeries } from "./chord-parts-series";
import { RequiredByChordNoteModel } from "./r-model";
import { RequiredByChordNotesSeries } from "./r-series";
import { IChordNotesSeries } from "./i-series";

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
