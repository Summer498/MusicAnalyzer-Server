import { AudioReflectableRegistry } from "./facade";
import { WindowReflectableRegistry } from "./facade";
import { TimeRangeController } from "./facade";

export interface RequiredByBeatBar {
  readonly audio: AudioReflectableRegistry,
  readonly window: WindowReflectableRegistry,
  readonly time_range: TimeRangeController,
}

