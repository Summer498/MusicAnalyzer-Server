import { TimeAndRomanAnalysis } from "@music-analyzer/chord-analyze";
import { PianoRollTranslateX } from "@music-analyzer/view-parameters";
import { AudioReflectableRegistry, MVVM_Collection } from "@music-analyzer/view";
import { ChordKey, RequiredByChordKey } from "./chord-key";

export interface RequiredByChordKeySeries
  extends RequiredByChordKey {
  readonly audio: AudioReflectableRegistry
}
export class ChordKeySeries
  extends MVVM_Collection<ChordKey> {
  readonly remaining: ChordKey | undefined;
  constructor(
    romans: TimeAndRomanAnalysis[],
    controllers: RequiredByChordKeySeries
  ) {
    super("key-names", romans.map(e => new ChordKey(e, controllers)));
    controllers.audio.register(this);
  }
  onAudioUpdate() { this.svg.setAttribute("transform", `translate(${PianoRollTranslateX.get()})`); }
}
