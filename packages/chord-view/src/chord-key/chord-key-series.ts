import { TimeAndRomanAnalysis } from "@music-analyzer/chord-analyze";
import { ReflectableTimeAndMVCControllerCollection } from "@music-analyzer/view";
import { ChordKeyController } from "./chord-key-controller";
import { ChordKeyModel } from "./chord-key-model";

export class ChordKeySeries extends ReflectableTimeAndMVCControllerCollection{
  constructor(
    romans: TimeAndRomanAnalysis[]
  ){
    const children = romans.map(e => new ChordKeyController(new ChordKeyModel(e)));
    super(children);
    this.svg.id = "key-names";
  }
}
