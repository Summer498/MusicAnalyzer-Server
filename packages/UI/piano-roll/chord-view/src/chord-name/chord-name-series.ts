import { TimeAndRomanAnalysis } from "@music-analyzer/chord-analyze";
import { ReflectableTimeAndMVCControllerCollection } from "@music-analyzer/view";
import { ChordName } from "./chord-name";

export class ChordNameSeries 
  extends ReflectableTimeAndMVCControllerCollection<ChordName> {
  constructor(romans: TimeAndRomanAnalysis[]) {
    super("chord-names", romans.map(e => new ChordName(e)));
  }
}
