import { AudioReflectableRegistry } from "@music-analyzer/view/src/reflectable/audio-reflectable-registry";
import { WindowReflectableRegistry } from "@music-analyzer/view/src/reflectable/window-reflectable-registry";
import { TimeRangeController } from "@music-analyzer/controllers/src/slider/time-range/time-range-controller";

export interface RequiredByBeatBar {
  readonly audio: AudioReflectableRegistry,
  readonly window: WindowReflectableRegistry,
  readonly time_range: TimeRangeController,
}

