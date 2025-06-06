export { chord_name_margin } from "./src/chord-view-params/margin";
export { chord_text_em } from "./src/chord-view-params/text-em";
export { chord_text_size } from "./src/chord-view-params/text-size";

import { buildChordKeySeries } from "./src/chord-key-series";
import { buildChordNotesSeries } from "./src/chord-note-series";
import { buildChordNameSeries } from "./src/chord-name-series";
import { buildChordRomanSeries } from "./src/chord-roman-series";

import { AudioReflectableRegistry } from "@music-analyzer/view";
import { WindowReflectableRegistry } from "@music-analyzer/view";
import { TimeRangeController } from "@music-analyzer/controllers";
import { SerializedTimeAndRomanAnalysis } from "@music-analyzer/chord-analyze";

import { Time } from "@music-analyzer/time-and";
import { Chord } from "@music-analyzer/tonal-objects";
import { getChord } from "@music-analyzer/tonal-objects";
import { getScale } from "@music-analyzer/tonal-objects";
import { Scale } from "@music-analyzer/tonal-objects";

interface IRequiredByChordPartModel {
  readonly time: Time
  readonly chord: Chord
  readonly scale: Scale
  readonly roman: string
}

const getRequiredByChordPartModel = (e: SerializedTimeAndRomanAnalysis) => ({
  time: e.time,
  chord: getChord(e.chord),
  scale: getScale(e.scale),
  roman: e.roman,
} as IRequiredByChordPartModel)

export interface RequiredByChordElements {
  readonly audio: AudioReflectableRegistry
  readonly window: WindowReflectableRegistry,
  readonly time_range: TimeRangeController,
}

export interface ChordElements {
  readonly children: SVGGElement[];
  readonly chord_keys: SVGGElement;
  readonly chord_names: SVGGElement;
  readonly chord_notes: SVGGElement;
  readonly chord_romans: SVGGElement;
}

export function createChordElements(
  romans: SerializedTimeAndRomanAnalysis[],
  controllers: RequiredByChordElements
): ChordElements {
  const data = romans.map(e => getRequiredByChordPartModel(e));
  const chord_keys = buildChordKeySeries(data, controllers);
  const chord_names = buildChordNameSeries(data, controllers);
  const chord_notes = buildChordNotesSeries(data, controllers);
  const chord_romans = buildChordRomanSeries(data, controllers);

  const children = [
    chord_keys,
    chord_names,
    chord_notes,
    chord_romans,
  ];

  return {
    children,
    chord_keys,
    chord_names,
    chord_notes,
    chord_romans,
  };
}
