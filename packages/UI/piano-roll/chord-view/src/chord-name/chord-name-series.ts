import { TimeAndRomanAnalysis } from "@music-analyzer/chord-analyze/src/chord-analyze/time-and-roman-analysis";
import { AudioReflectable} from "@music-analyzer/view/src/reflectable/audio-reflectable";
import { ReflectableTimeAndMVCControllerCollection } from "@music-analyzer/view/src/reflectable-time-and-mvc-controller-collection/reflectable-time-and-mvc-controller-collection";
import { WindowReflectable } from "@music-analyzer/view/src/reflectable/window-reflectable";
import { ChordName } from "./chord-name/chord-name";
import { TimeRangeSubscriber } from "@music-analyzer/controllers/src/slider/time-range/time-range-subscriber";
import { RequiredByChordNameSeries } from "../requirement/name/chord-name-series";

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
