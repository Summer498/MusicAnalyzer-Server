import { TimeAndRomanAnalysis } from "@music-analyzer/chord-analyze";
import { ChordKeySeries, ChordNameSeries, ChordNotesSeries, ChordRomanSeries } from "@music-analyzer/chord-view";

export class ChordElements {
  readonly chord_notes: ChordNotesSeries;
  readonly chord_names: ChordNameSeries;
  readonly chord_romans: ChordRomanSeries;
  readonly chord_keys: ChordKeySeries;
  constructor(
    romans: TimeAndRomanAnalysis[],
  ){
    this.chord_notes = new ChordNotesSeries(romans);
    this.chord_names = new ChordNameSeries(romans);
    this.chord_romans = new ChordRomanSeries(romans);
    this.chord_keys = new ChordKeySeries(romans);
  }
}
