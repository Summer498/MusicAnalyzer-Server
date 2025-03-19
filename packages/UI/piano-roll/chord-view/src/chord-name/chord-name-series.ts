import { TimeAndRomanAnalysis } from "@music-analyzer/chord-analyze";
import { ReflectableTimeAndMVCControllerCollection } from "@music-analyzer/view";
import { ChordNameVM } from "./chord-name-view-model";

export class ChordNameSeries 
  extends ReflectableTimeAndMVCControllerCollection<ChordNameVM> {
  constructor(romans: TimeAndRomanAnalysis[]) {
    super("chord-names", romans.map(e => new ChordNameVM(e)));
  }
}
