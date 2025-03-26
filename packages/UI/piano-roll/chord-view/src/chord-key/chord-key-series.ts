import { TimeAndRomanAnalysis } from "@music-analyzer/chord-analyze";
import { PianoRollTranslateX } from "@music-analyzer/view-parameters";
import { AudioReflectable } from "@music-analyzer/view";
import { AudioReflectableRegistry } from "@music-analyzer/view";
import { MVVM_Collection } from "@music-analyzer/view";
import { WindowReflectable } from "@music-analyzer/view";
import { ChordKey } from "./chord-key";
import { RequiredByChordKey } from "./chord-key";
import { TimeRangeSubscriber } from "@music-analyzer/controllers";

export interface RequiredByChordKeySeries
  extends RequiredByChordKey {
  readonly audio: AudioReflectableRegistry
}

export class ChordKeySeries
  extends MVVM_Collection<ChordKey>
  implements
  AudioReflectable,
  TimeRangeSubscriber,
  WindowReflectable {
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
