import { TimeAndRomanAnalysis } from "@music-analyzer/chord-analyze/src/chord-analyze/time-and-roman-analysis";
import { PianoRollTranslateX } from "@music-analyzer/view-parameters/src/piano-roll-translate-x";
import { AudioReflectable } from "@music-analyzer/view/src/reflectable/audio-reflectable";
import { MVVM_Collection } from "@music-analyzer/view/src/mvvm/collection";
import { WindowReflectable } from "@music-analyzer/view/src/reflectable/window-reflectable";
import { ChordKey } from "./chord-key/chord-key";
import { TimeRangeSubscriber } from "@music-analyzer/controllers/src/slider/time-range/time-range-subscriber";
import { RequiredByChordKeySeries } from "../requirement/key/chord-key-series";

export interface IChordKeySeries
  extends
  AudioReflectable,
  TimeRangeSubscriber,
  WindowReflectable { }

export class ChordKeySeries
  extends MVVM_Collection<ChordKey>
  implements IChordKeySeries {
  readonly remaining: ChordKey | undefined;
  constructor(
    romans: TimeAndRomanAnalysis[],
    controllers: RequiredByChordKeySeries
  ) {
    super("key-names", romans.map(e => new ChordKey(e)));
    controllers.audio.register(this);
    controllers.time_range.register(this);
    controllers.window.register(this);
  }
  onAudioUpdate() { this.svg.setAttribute("transform", `translate(${PianoRollTranslateX.get()})`) }
  onTimeRangeChanged() { this.children.forEach(e => e.onTimeRangeChanged()) }
  onWindowResized() { this.children.forEach(e => e.onWindowResized()) }
}
