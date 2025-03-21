import { TimeAndRomanAnalysis } from "@music-analyzer/chord-analyze";
import { AudioReflectableRegistry, ReflectableTimeAndMVCControllerCollection } from "@music-analyzer/view";
import { ChordRoman, RequiredByChordRoman } from "./chord-roman";

export interface RequiredByChordRomanSeries
extends RequiredByChordRoman{
  readonly audio:AudioReflectableRegistry
}
export class ChordRomanSeries 
  extends ReflectableTimeAndMVCControllerCollection<ChordRoman> {
  constructor(
    romans: TimeAndRomanAnalysis[],
    controllers: RequiredByChordRomanSeries,
  ) {
    super("roman-names", romans.map(e => new ChordRoman(e, controllers)));
    controllers.audio.register(this);
  }
}
