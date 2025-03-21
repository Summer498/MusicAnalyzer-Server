import { TimeAndRomanAnalysis } from "@music-analyzer/chord-analyze";
import { ChordKeySeries, ChordNameSeries, ChordNotesSeries, ChordRomanSeries } from "@music-analyzer/chord-view";
import { RequiredByChordKeySeries } from "@music-analyzer/chord-view/src/chord-key/chord-key-series";
import { RequiredByChordNameSeries } from "@music-analyzer/chord-view/src/chord-name/chord-name-series";
import { RequiredByChordNotesSeries } from "@music-analyzer/chord-view/src/chord-note/chord-note-series";

interface RequiredByChordElements
  extends
  RequiredByChordKeySeries,
  RequiredByChordNameSeries,
  RequiredByChordNotesSeries { }
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
    this.chord_romans = new ChordRomanSeries(romans, [controllers.audio, controllers.window]);
    this.children = [
      this.chord_keys,
      this.chord_names,
      this.chord_notes,
      this.chord_romans,
    ];
  }
}
