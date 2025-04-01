import { SerializedTimeAndRomanAnalysis } from "./facade";
import { RequiredByChordElements } from "./r-chord-elements";
import { RequiredByChordPartModel } from "./r-model";
import { ChordKeySeries } from "./series";
import { ChordNameSeries } from "./series";
import { ChordNotesSeries } from "./series";
import { ChordRomanSeries } from "./series";

export class ChordElements {
  readonly children: unknown[];
  readonly chord_keys: ChordKeySeries;
  readonly chord_names: ChordNameSeries;
  readonly chord_notes: ChordNotesSeries;
  readonly chord_romans: ChordRomanSeries;
  constructor(
    romans: SerializedTimeAndRomanAnalysis[],
    controllers: RequiredByChordElements
  ) {
    const data = romans.map(e => new RequiredByChordPartModel(e))
    this.chord_keys = new ChordKeySeries(data, controllers);
    this.chord_names = new ChordNameSeries(data, controllers);
    this.chord_notes = new ChordNotesSeries(data, controllers);
    this.chord_romans = new ChordRomanSeries(data, controllers);
    this.children = [
      this.chord_keys,
      this.chord_names,
      this.chord_notes,
      this.chord_romans,
    ];
  }
}
