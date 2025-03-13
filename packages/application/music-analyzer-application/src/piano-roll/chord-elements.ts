import { TimeAndRomanAnalysis } from "@music-analyzer/chord-analyze";
import { ChordKeySeries, ChordNameSeries, ChordNotesSeries, ChordRomanSeries } from "@music-analyzer/chord-view";
import { AudioReflectable, WindowReflectable } from "@music-analyzer/view";

export class ChordElements implements AudioReflectable, WindowReflectable {
  readonly children: (AudioReflectable & WindowReflectable)[];
  readonly chord_keys: ChordKeySeries;
  readonly chord_names: ChordNameSeries;
  readonly chord_notes: ChordNotesSeries;
  readonly chord_romans: ChordRomanSeries;
  constructor(
    romans: TimeAndRomanAnalysis[],
  ) {
    this.chord_keys = new ChordKeySeries(romans);
    this.chord_names = new ChordNameSeries(romans);
    this.chord_notes = new ChordNotesSeries(romans);
    this.chord_romans = new ChordRomanSeries(romans);
    this.children = [
      this.chord_keys,
      this.chord_names,
      this.chord_notes,
      this.chord_romans,
    ];
  }
  onAudioUpdate() {
    this.children.forEach(e => e.onAudioUpdate());
  }
  onWindowResized() {
    this.children.forEach(e => e.onWindowResized());
  }
}
