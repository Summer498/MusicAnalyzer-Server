import { TimeAndRomanAnalysis } from "@music-analyzer/chord-analyze/src/chord-analyze/time-and-roman-analysis";
import { AudioReflectable} from "@music-analyzer/view/src/reflectable/audio-reflectable";
import { ReflectableTimeAndMVCControllerCollection } from "@music-analyzer/view/src/reflectable-time-and-mvc-controller-collection/reflectable-time-and-mvc-controller-collection";
import { WindowReflectable } from "@music-analyzer/view/src/reflectable/window-reflectable";
import { ChordRoman } from "./chord-roman/chord-roman";
import { TimeRangeSubscriber } from "@music-analyzer/controllers/src/slider/time-range/time-range-subscriber";
import { RequiredByChordRomanSeries } from "../requirement/chord-roman-series";

export class ChordRomanSeries
  extends ReflectableTimeAndMVCControllerCollection<ChordRoman>
  implements
  AudioReflectable,
  TimeRangeSubscriber,
  WindowReflectable {
  constructor(
    romans: TimeAndRomanAnalysis[],
    controllers: RequiredByChordRomanSeries,
  ) {
    super("roman-names", romans.map(e => new ChordRoman(e)));
    controllers.audio.register(this);
    controllers.window.register(this);
    controllers.time_range.register(this);
  }
  onTimeRangeChanged(){this.children.forEach(e=>e.onTimeRangeChanged())}
  onWindowResized(){this.children.forEach(e=>e.onWindowResized())}
}
