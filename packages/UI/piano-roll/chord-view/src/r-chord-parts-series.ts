import { AudioReflectableRegistry } from "@music-analyzer/view";
import { WindowReflectableRegistry } from "@music-analyzer/view";
import { TimeRangeController } from "@music-analyzer/controllers";
import { SerializedTimeAndRomanAnalysis } from "@music-analyzer/chord-analyze";
import { Time } from "@music-analyzer/time-and";
import { Chord } from "@music-analyzer/tonal-objects";
import { getChord } from "@music-analyzer/tonal-objects";
import { getScale } from "@music-analyzer/tonal-objects";
import { Scale } from "@music-analyzer/tonal-objects";

export class RequiredByChordPartModel {
  readonly time: Time
  readonly chord: Chord
  readonly scale: Scale
  readonly roman: string
  constructor(e:SerializedTimeAndRomanAnalysis){
    this.time = e.time
    this.chord = getChord(e.chord)
    this.scale = getScale(e.scale)
    this.roman = e.scale
  }
}

export interface RequiredByChordPart {
  readonly window: WindowReflectableRegistry,
  readonly time_range: TimeRangeController,
}

export interface RequiredByChordPartSeries
  extends RequiredByChordPart {
  readonly audio: AudioReflectableRegistry
}
