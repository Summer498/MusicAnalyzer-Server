import { ChordNotes } from "./facade";
import { ChordPartSeries } from "./chord-parts-series";
import { RequiredByChordNoteModel } from "./facade";
import { RequiredByChordNotesSeries } from "./facade";
import { IChordNotesSeries } from "./facade";

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
