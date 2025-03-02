import { TimeAndRomanAnalysis } from "@music-analyzer/chord-analyze";
import { ReflectableTimeAndMVCControllerCollection } from "@music-analyzer/view";
import { ChordNameVM } from "./chord-name-controller";
import { ChordNameModel } from "./chord-name-model";

export class ChordNameSeries extends ReflectableTimeAndMVCControllerCollection {
  constructor(
    romans: TimeAndRomanAnalysis[]
  ){
    const children = romans.map(e => new ChordNameVM(new ChordNameModel(e)));
    super(children);
    this.svg.id = "chord-names";
  }
}
