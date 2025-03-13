import { TimeAndRomanAnalysis } from "@music-analyzer/chord-analyze";
import { ReflectableTimeAndMVCControllerCollection } from "@music-analyzer/view";
import { ChordRomanVM } from "./chord-roman-view-model";

export class ChordRomanSeries extends ReflectableTimeAndMVCControllerCollection<ChordRomanVM> {
  constructor(romans: TimeAndRomanAnalysis[]) {
    super("roman-names", romans.map(e => new ChordRomanVM(e)));
  }
} 
