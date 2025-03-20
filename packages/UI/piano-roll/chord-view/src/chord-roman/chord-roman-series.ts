import { TimeAndRomanAnalysis } from "@music-analyzer/chord-analyze";
import { AudioReflectableRegistry, ReflectableTimeAndMVCControllerCollection, WindowReflectableRegistry } from "@music-analyzer/view";
import { ChordRoman } from "./chord-roman";

export class ChordRomanSeries 
  extends ReflectableTimeAndMVCControllerCollection<ChordRoman> {
  constructor(
    romans: TimeAndRomanAnalysis[],
    publisher: [AudioReflectableRegistry, WindowReflectableRegistry]
  ) {
    super("roman-names", romans.map(e => new ChordRoman(e)));
    publisher.forEach(e=>e.register(this));
  }
} 
