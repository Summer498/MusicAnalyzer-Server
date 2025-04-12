import { ChordNotes } from "../part";
import { RequiredByChordNoteModel } from "../r-model";
import { RequiredByChordNotesSeries } from "../r-series";
import { ChordPartSeries } from "./chord-parts-series";

export class ChordNotesSeries
  extends ChordPartSeries<ChordNotes> {
  constructor(
    romans: RequiredByChordNoteModel[],
    controllers: RequiredByChordNotesSeries
  ) {
    super("chords", controllers, romans.map(roman => new ChordNotes(roman)));
  }
}
