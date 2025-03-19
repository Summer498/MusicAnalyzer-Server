import { TimeAndRomanAnalysis } from "@music-analyzer/chord-analyze";
import { ChordKeyVM } from "./chord-key-view-model";
import { PianoRollTranslateX } from "@music-analyzer/view-parameters";
import { MVVM_Collection } from "@music-analyzer/view";

export class ChordKeySeries 
extends MVVM_Collection<ChordKeyVM> {
  readonly remaining: ChordKeyVM | undefined;
  constructor(romans: TimeAndRomanAnalysis[]) {
    super("key-names", romans.map(e => new ChordKeyVM(e)));
  }

  onAudioUpdate() {
    this.svg.setAttribute("transform", `translate(${PianoRollTranslateX.get()})`);
  }
}
