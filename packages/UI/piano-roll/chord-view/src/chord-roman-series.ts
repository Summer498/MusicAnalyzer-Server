import { IChordRomanSeries } from "./i-chord-roman-series";
import { RequiredByChordRomanSeries } from "./r-chord-roman-series";
import { ChordRoman } from "./chord-roman";
import { ChordPartSeries } from "./chord-parts-series";
import { RequiredByChordRomanModel } from "./r-chord-roman-model";

export class ChordRomanSeries
  extends ChordPartSeries<ChordRoman>
  implements IChordRomanSeries {
  constructor(
    romans: RequiredByChordRomanModel[],
    controllers: RequiredByChordRomanSeries,
  ) {
    super("roman-names", controllers, romans.map(e => new ChordRoman(e)));
  }
}
