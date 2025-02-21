import { TimeAndRomanAnalysis } from "@music-analyzer/chord-analyze";
import { ChordNameController } from "./chord-name-controller";
import { ChordNameModel } from "./chord-name-model";
import { ReflectableTimeAndMVCControllerCollection } from "@music-analyzer/view";

export class ChordNameSeries extends ReflectableTimeAndMVCControllerCollection {
  constructor(
    romans: TimeAndRomanAnalysis[]
  ){
    const children = romans.map(e => new ChordNameController(new ChordNameModel(e)));
    super(children);
    this.svg.id = "chord-names";
  }
}
