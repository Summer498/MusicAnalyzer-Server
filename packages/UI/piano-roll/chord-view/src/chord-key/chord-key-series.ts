import { TimeAndRomanAnalysis } from "@music-analyzer/chord-analyze";
import { ChordKey } from "./chord-key";
import { PianoRollTranslateX } from "@music-analyzer/view-parameters";
import { MVVM_Collection } from "@music-analyzer/view";

export class ChordKeySeries 
  extends MVVM_Collection<ChordKey> {
  readonly remaining: ChordKey | undefined;
  constructor(romans: TimeAndRomanAnalysis[]) {
    super("key-names", romans.map(e => new ChordKey(e)));
  }

  onAudioUpdate() {
    this.svg.setAttribute("transform", `translate(${PianoRollTranslateX.get()})`);
  }
}
