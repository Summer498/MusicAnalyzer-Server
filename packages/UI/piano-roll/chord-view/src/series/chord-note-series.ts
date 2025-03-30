import { ChordNotes } from "./facade/part";
import { ChordPartSeries } from "./chord-parts-series";
import { RequiredByChordNoteModel } from "./facade/r-model";
import { RequiredByChordNotesSeries } from "./facade/r-series";
import { IChordNotesSeries } from "./facade/i-series";

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
