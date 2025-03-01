import { TimeAndRomanAnalysis } from "@music-analyzer/chord-analyze";
import { ReflectableTimeAndMVCControllerCollection } from "@music-analyzer/view";
import { ChordKeyVM } from "./chord-key-view-model";
import { ChordKeyModel } from "./chord-key-model";

export class ChordKeySeries extends ReflectableTimeAndMVCControllerCollection<ChordKeyVM> {
  constructor(romans: TimeAndRomanAnalysis[]) {
    super("key-names", romans.map(e => new ChordKeyVM(new ChordKeyModel(e))));
  }
}
