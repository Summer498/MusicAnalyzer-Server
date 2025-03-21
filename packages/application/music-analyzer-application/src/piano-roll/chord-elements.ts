import { TimeAndRomanAnalysis } from "@music-analyzer/chord-analyze";
import { ChordKeySeries, ChordNameSeries, ChordNotesSeries, ChordRomanSeries } from "@music-analyzer/chord-view";
import { AudioReflectableRegistry, WindowReflectableRegistry } from "@music-analyzer/view";

export class ChordElements {
  readonly children: unknown[];
  readonly chord_keys: ChordKeySeries;
  readonly chord_names: ChordNameSeries;
  readonly chord_notes: ChordNotesSeries;
  readonly chord_romans: ChordRomanSeries;
  constructor(
    romans: TimeAndRomanAnalysis[],
    controllers: [AudioReflectableRegistry, WindowReflectableRegistry]
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
