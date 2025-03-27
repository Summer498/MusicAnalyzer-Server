import { TimeAndRomanAnalysis } from "@music-analyzer/chord-analyze/src/chord-analyze/time-and-roman-analysis";
import { ChordKeySeries } from "./chord-key";
import { RequiredByChordKeySeries } from "./chord-key";
import { ChordNameSeries } from "./chord-name";
import { RequiredByChordNameSeries } from "./chord-name";
import { ChordNotesSeries } from "./chord-note";
import { RequiredByChordNotesSeries } from "./chord-note";
import { ChordRomanSeries } from "./chord-roman";
import { RequiredByChordRomanSeries } from "./chord-roman";

export interface RequiredByChordElements
  extends
  RequiredByChordKeySeries,
  RequiredByChordNameSeries,
  RequiredByChordNotesSeries,
  RequiredByChordRomanSeries { }

  export class ChordElements {
  readonly children: unknown[];
  readonly chord_keys: ChordKeySeries;
  readonly chord_names: ChordNameSeries;
  readonly chord_notes: ChordNotesSeries;
  readonly chord_romans: ChordRomanSeries;
  constructor(
    romans: TimeAndRomanAnalysis[],
    controllers: RequiredByChordElements
  ) {
    this.chord_keys = new ChordKeySeries(romans, controllers);
    this.chord_names = new ChordNameSeries(romans, controllers);
    this.chord_notes = new ChordNotesSeries(romans, controllers);
    this.chord_romans = new ChordRomanSeries(romans, controllers);
    this.children = [
      this.chord_keys,
      this.chord_names,
      this.chord_notes,
      this.chord_romans,
    ];
  }
}
