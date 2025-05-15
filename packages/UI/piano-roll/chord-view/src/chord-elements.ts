import { ChordKeySeries } from "./chord-key-series";
import { ChordNotesSeries } from "./chord-note-series";
import { ChordNameSeries } from "./chord-name-series";
import { ChordRomanSeries } from "./chord-roman-series";

import { AudioReflectableRegistry } from "@music-analyzer/view";
import { WindowReflectableRegistry } from "@music-analyzer/view";
import { TimeRangeController } from "@music-analyzer/controllers";
import { SerializedTimeAndRomanAnalysis } from "@music-analyzer/chord-analyze";
import { RequiredByChordPartModel } from "./require-by-chord-part-model";

export interface RequiredByChordElements {
  readonly audio: AudioReflectableRegistry
  readonly window: WindowReflectableRegistry,
  readonly time_range: TimeRangeController,
  }

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
