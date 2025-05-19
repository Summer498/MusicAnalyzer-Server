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
  readonly chord_keys: SVGGElement;
  readonly chord_names: SVGGElement;
  readonly chord_notes: SVGGElement;
  readonly chord_romans: SVGGElement;
  constructor(
    romans: SerializedTimeAndRomanAnalysis[],
    controllers: RequiredByChordElements
  ) {
    const data = romans.map(e => new RequiredByChordPartModel(e))
    const chord_keys = new ChordKeySeries(data, controllers);
    const chord_names = new ChordNameSeries(data, controllers);
    const chord_notes = new ChordNotesSeries(data, controllers);
    const chord_romans = new ChordRomanSeries(data, controllers);

    this.chord_keys = chord_keys.svg;
    this.chord_names = chord_names.svg;
    this.chord_notes = chord_notes.svg;
    this.chord_romans = chord_romans.svg;

    this.children = [
      this.chord_keys,
      this.chord_names,
      this.chord_notes,
      this.chord_romans,
    ];
  }
}
