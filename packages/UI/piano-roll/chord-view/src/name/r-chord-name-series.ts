import { AudioReflectableRegistry } from "@music-analyzer/view";
import { WindowReflectableRegistry } from "@music-analyzer/view";
import { TimeRangeController } from "@music-analyzer/controllers";
import { RequiredByChordPartModel } from "../r-chord-parts-series";

export interface RequiredByChordNameModel
  extends RequiredByChordPartModel { }

export interface RequiredByChordPart {
  readonly window: WindowReflectableRegistry,
  readonly time_range: TimeRangeController,
}

export interface RequiredByChordPartSeries
  extends RequiredByChordPart {
  readonly audio: AudioReflectableRegistry
}

export interface RequiredByChordNameSeries
  extends RequiredByChordPartSeries {
}
