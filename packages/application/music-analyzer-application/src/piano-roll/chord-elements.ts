import { TimeAndRomanAnalysis } from "@music-analyzer/chord-analyze";
import { ChordKeySeries, ChordNameSeries, ChordNotesSeries, ChordRomanSeries } from "@music-analyzer/chord-view";
import { AudioReflectable, AudioReflectableRegistry, WindowReflectable, WindowReflectableRegistry } from "@music-analyzer/view";

export class ChordElements {
  readonly children: (AudioReflectable & WindowReflectable)[];
  readonly chord_keys: ChordKeySeries;
  readonly chord_names: ChordNameSeries;
  readonly chord_notes: ChordNotesSeries;
  readonly chord_romans: ChordRomanSeries;
  constructor(
    romans: TimeAndRomanAnalysis[],
    publisher: [AudioReflectableRegistry, WindowReflectableRegistry]
  ) {
    this.chord_keys = new ChordKeySeries(romans, publisher);
    this.chord_names = new ChordNameSeries(romans, publisher);
    this.chord_notes = new ChordNotesSeries(romans, publisher);
    this.chord_romans = new ChordRomanSeries(romans, publisher);
    this.children = [
      this.chord_keys,
      this.chord_names,
      this.chord_notes,
      this.chord_romans,
    ];
  }
}
