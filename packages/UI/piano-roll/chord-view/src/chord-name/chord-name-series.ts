import { TimeAndRomanAnalysis } from "@music-analyzer/chord-analyze";
import { AudioReflectable} from "@music-analyzer/view/src/reflectable/audio-reflectable";
import { AudioReflectableRegistry } from "@music-analyzer/view/src/reflectable/audio-reflectable-registry";
import { ReflectableTimeAndMVCControllerCollection } from "@music-analyzer/view/src/svg-collection";
import { WindowReflectable } from "@music-analyzer/view/src/reflectable/window-reflectable";
import { WindowReflectableRegistry } from "@music-analyzer/view/src/reflectable/window-reflectable-registry";
import { ChordName } from "./chord-name";
import { RequiredByChordName } from "./chord-name";
import { TimeRangeSubscriber } from "@music-analyzer/controllers";

export interface RequiredByChordNameSeries
  extends RequiredByChordName {
  readonly audio: AudioReflectableRegistry
}
export class ChordNameSeries
  extends ReflectableTimeAndMVCControllerCollection<ChordName>
  implements
  AudioReflectable,
  TimeRangeSubscriber,
  WindowReflectable {
  constructor(
    romans: TimeAndRomanAnalysis[],
    controllers: RequiredByChordNameSeries,
  ) {
    super("chord-names", romans.map(e => new ChordName(e)));
    controllers.audio.register(this);
    controllers.window.register(this);
    controllers.time_range.register(this);
  }
  onTimeRangeChanged() { this.children.forEach(e => e.onTimeRangeChanged()) }
  onWindowResized() { this.children.forEach(e => e.onWindowResized()) }
}
