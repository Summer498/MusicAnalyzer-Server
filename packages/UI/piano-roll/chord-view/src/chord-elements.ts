import { SerializedTimeAndRomanAnalysis } from "@music-analyzer/chord-analyze";
import { ChordKeySeries } from "./key/chord-key-series";
import { ChordNotesSeries } from "./note/chord-note-series";
import { RequiredByChordElements } from "./r-chord-elements";
import { ChordNameSeries } from "./name/chord-name-series";
import { ChordRomanSeries } from "./roman/chord-roman-series";
import { RequiredByChordPartModel } from "./r-chord-parts-series";

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
