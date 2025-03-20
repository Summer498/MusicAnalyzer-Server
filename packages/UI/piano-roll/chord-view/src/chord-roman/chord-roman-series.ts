import { TimeAndRomanAnalysis } from "@music-analyzer/chord-analyze";
import { ReflectableTimeAndMVCControllerCollection } from "@music-analyzer/view";
import { ChordRoman } from "./chord-roman-view-model";

export class ChordRomanSeries 
  extends ReflectableTimeAndMVCControllerCollection<ChordRoman> {
  constructor(romans: TimeAndRomanAnalysis[]) {
    super("roman-names", romans.map(e => new ChordRoman(e)));
  }
} 
