import { TimeAndRomanAnalysis } from "@music-analyzer/chord-analyze";
import { PianoRollTranslateX } from "@music-analyzer/view-parameters";
import { AudioReflectableRegistry, MVVM_Collection, WindowReflectableRegistry } from "@music-analyzer/view";
import { ChordKey } from "./chord-key";

export class ChordKeySeries
  extends MVVM_Collection<ChordKey> {
  readonly remaining: ChordKey | undefined;
  constructor(
    romans: TimeAndRomanAnalysis[],
    publisher: [AudioReflectableRegistry, WindowReflectableRegistry]
  ) {
    super("key-names", romans.map(e => new ChordKey(e, [publisher[1]])));
    publisher[0].register(this);
  }
  onAudioUpdate() { this.svg.setAttribute("transform", `translate(${PianoRollTranslateX.get()})`); }
}
